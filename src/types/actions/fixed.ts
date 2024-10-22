import { z } from 'zod';

export const fixedActionType = z.enum(['setZoom']);
export type FixedActionType = z.infer<typeof fixedActionType>;

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
export type FixedAction = z.infer<typeof fixedAction>;
