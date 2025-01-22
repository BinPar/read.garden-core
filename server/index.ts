import express from 'express';
import chalk from 'chalk';
import ngrok from 'ngrok';
import cors from 'cors';
import { default as jsonwebtoken } from 'jsonwebtoken';
import { z } from 'zod';

import getSignerUrl from 'server/lib/getSignerUrl';
import setValue from 'server/tools/redis/setValue';

import { env, timestamp } from './env';
import genericCatch from '@/tools/genericCatch';

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

const port = process.env.SERVER_PORT || 3001;

app.listen(port, () => {
  console.info(
    `::: ${chalk.yellow(`Server listening at`)} ${chalk.green(`http://localhost:${port}`)}`,
  );
  if (process.env.WITH_NGROK) {
    ngrok
      .connect({
        proto: 'http',
        addr: port,
      })
      .then((serverUrl) => {
        console.info(
          `::: ${chalk.yellow('Server available with Ngrok on:')} ${chalk.green(serverUrl)}`,
        );
        ngrokUrl = serverUrl;
        ngrok
          .connect({
            proto: 'http',
            addr: process.env.PORT ?? 3000,
          })
          .then((url) => {
            console.info(
              `::: ${chalk.yellow('Web available with Ngrok on:')} ${chalk.green(`${url}?server=${encodeURIComponent(serverUrl)}`)}`,
            );
          })
          .catch(genericCatch('Error serving web with ngrok'));
      })
      .catch(genericCatch('Error serving server with ngrok'));
  }
});
