import { z } from 'zod';

export const fixedActionType = z.enum(['setZoom']);

export const fixedAction = z
  .object({
    type: fixedActionType,
  })
  .and(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal(fixedActionType.Values.setZoom),
        payload: z.number(),
      }),
    ]),
  );
