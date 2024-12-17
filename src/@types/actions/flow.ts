import { z } from 'zod';

export const flowActionType = z.enum(['setFontSize']);

export const flowAction = z
  .object({
    type: flowActionType,
  })
  .and(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal(flowActionType.Values.setFontSize),
        payload: z.number(),
      }),
    ]),
  );
