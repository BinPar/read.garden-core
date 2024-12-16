import { z } from 'zod';

const envSchema = z.object({
  REDIS_URL: z.string().min(1),
  CLOUDFRONT_URL: z.string().min(1),
  PROJECT_SLUG: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(parsedEnv.error.issues.join('\n'));
}

export const { data: env } = parsedEnv;

export const timestamp = Date.now();
