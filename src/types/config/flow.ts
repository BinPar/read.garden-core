import { z } from 'zod';

export const flowOptions = z.object({
  fontSize: z.number().min(8).max(24).optional().default(12),
});
