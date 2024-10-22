import { z } from 'zod';

export const buttonType = z.enum(['forward', 'backward']);

export const button = z.object({
  type: buttonType,
  text: z.string().optional(),
  icon: z.string().optional(),
  title: z.string().optional(),
});
