/* eslint-disable @typescript-eslint/no-misused-promises */
import * as ngrok from '@ngrok/ngrok';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';
import { default as jsonwebtoken } from 'jsonwebtoken';
import { z } from 'zod';

import genericCatch from '@/tools/genericCatch';
import getSignerUrl from 'server/lib/getSignerUrl';
import setValue from 'server/tools/redis/setValue';
import { env, timestamp } from './env';

const app = express();
app.use(cors());

let ngrokUrl = '';

app.get('/set-cookies', async (req, res) => {
  const signerUrl = getSignerUrl();

  if (!signerUrl) {
    res.status(404).end();
    return;
  }

  const { key } = z
    .object({
      key: z.string().min(1),
    })
    .parse(req.query);

  const sessionId = 'core-dev';
  const redisKey = `${env.PROJECT_SLUG}_${sessionId}-${key}`;
  await setValue(redisKey, '1');

  const token = jsonwebtoken.sign(
    { sessionId, productSlug: key, sameSiteNone: true },
    env.JWT_SECRET,
  );

  res.redirect(`${signerUrl}/set-cookies?token=${token}&v=${timestamp}`);
});

app.get('/get-books', (_, res) => {
  res.status(200).json({
    books: env.BOOKS_S3_KEYS,
    cloudFrontUrl: `${env.CLOUDFRONT_URL}/${env.BOOKS_S3_FOLDER}`,
    ngrokUrl,
  });
});

const port = process.env.SERVER_PORT ?? 3001;

type NgrokListener = { url(): string; close(): Promise<void> };

let serverListener: NgrokListener | null = null;
let webListener: NgrokListener | null = null;
let starting = false;

async function stopNgrok() {
  try {
    await serverListener?.close();
  } catch {}
  try {
    await webListener?.close();
  } catch {}

  serverListener = null;
  webListener = null;
}

async function startNgrok() {
  if (starting) return;
  starting = true;

  // Si tsx watch reinicia, intenta cerrar en este proceso primero
  await stopNgrok();

  if (!process.env.NGROK_AUTHTOKEN) {
    starting = false;
    throw new Error('NGROK_AUTHTOKEN is missing. Add it to your .env');
  }
  await ngrok.authtoken(process.env.NGROK_AUTHTOKEN);

  // 1) túnel al server (3001 por defecto)
  serverListener = (await ngrok.forward({
    proto: 'http',
    addr: port,
  })) as unknown as NgrokListener;

  const serverUrl = serverListener.url();
  ngrokUrl = serverUrl;

  console.info(
    `::: ${chalk.yellow('Server available with ngrok on:')} ${chalk.green(serverUrl)}`,
  );

  // 2) túnel a la web (http-server ./web en 3000 por defecto)
  const webPort = process.env.PORT ?? 3000;

  webListener = (await ngrok.forward({
    proto: 'http',
    addr: webPort,
  })) as unknown as NgrokListener;

  const webUrl = webListener.url();

  console.info(
    `::: ${chalk.yellow('Web available with ngrok on:')} ${chalk.green(
      `${webUrl}?server=${encodeURIComponent(serverUrl)}`,
    )}`,
  );

  starting = false;
}

process.on('SIGINT', async () => {
  await stopNgrok();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopNgrok();
  process.exit(0);
});

// -------------------- BOOT --------------------
app.listen(port, () => {
  console.info(
    `::: ${chalk.yellow('Server listening at')} ${chalk.green(`http://localhost:${port}`)}`,
  );

  // ✅ tu validación queda tal cual (no la toco)
  if (process.env.WITH_NGROK) {
    startNgrok().catch(genericCatch('Error serving with ngrok'));
  }
});
