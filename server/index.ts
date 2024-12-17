import express from 'express';
import cors from 'cors';
import { default as jsonwebtoken } from 'jsonwebtoken';
import { z } from 'zod';

import getSignerUrl from 'server/lib/getSignerUrl';
import setValue from 'server/tools/redis/setValue';

import { env, timestamp } from './env';

const app = express();

app.use(cors());

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
  res
    .status(200)
    .json({
      books: env.BOOKS_S3_KEYS,
      cloudFrontUrl: `${env.CLOUDFRONT_URL}/${env.BOOKS_S3_FOLDER}`,
    });
});

app.listen(3001, () => {
  console.log('Hello there');
});
