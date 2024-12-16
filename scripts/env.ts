import { z } from 'zod';

const envSchema = z.object({
  CONTENTS: z
    .string()
    .min(1)
    .transform((src) => src.split(',')),
  INDEXES: z
    .string()
    .min(1)
    .transform(
      (src) =>
        src.split(',').map((index) => parseInt(index, 10)) as [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
        ],
    ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(parsedEnv.error.issues.join('\n'));
}

export const { data: env } = parsedEnv;
