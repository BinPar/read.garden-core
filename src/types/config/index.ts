import { z } from 'zod';

export const layout = z.enum(['fixed', 'flow']);

export const config = z.object({
  layout,
});

export type Layout = z.infer<typeof layout>;
export type Config = z.infer<typeof config>;
