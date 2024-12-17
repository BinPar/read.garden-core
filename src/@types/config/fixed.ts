import { z } from 'zod';

export const fit = z.enum(['width', 'height', 'page']);

export const fixedOptions = z.object({
  fit: fit.optional().default('page'),
});

export const fixedConfig = z.object({
  fit: fit.optional(),
});
