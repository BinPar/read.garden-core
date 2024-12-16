import express from 'express';
import { default as jsonwebtoken } from 'jsonwebtoken';
import { z } from 'zod';

import getSignerUrl from 'server/lib/getSignerUrl';
import setValue from 'server/tools/redis/setValue';

import { env, timestamp } from './env';

const app = express();

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

  console.log({ signerUrl, sessionId, key, secret: env.JWT_SECRET });

  res.redirect(`${signerUrl}/set-cookies?token=${token}&v=${timestamp}`);
});

app.listen(3000, () => {
  console.log('Hello there');
});
