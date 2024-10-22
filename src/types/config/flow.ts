import { z } from 'zod';

export const fontSize = z.number().min(8).max(24);

export const flowOptions = z.object({
  fontSize: fontSize.or(z.undefined()).default(12),
});

export const flowConfig = z.object({
  fontSize,
});