import { z } from 'zod';

const envSchema = z.object({
  REDIS_URL: z.string().min(1),
  CLOUDFRONT_URL: z.string().min(1),
  PROJECT_SLUG: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  BOOKS_S3_FOLDER: z.string().optional().default('contents'),
  BOOKS_S3_KEYS: z.string().optional().transform((src) => {
    if (src) {
      return src.split(',');
    }
  }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(parsedEnv.error.toString());
}

export const { data: env } = parsedEnv;

export const timestamp = Date.now();
