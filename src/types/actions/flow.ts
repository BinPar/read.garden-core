import { z } from 'zod';

export const flowActionType = z.enum(['setFontSize']);
export type FlowActionType = z.infer<typeof flowActionType>;

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
export type FlowAction = z.infer<typeof flowAction>;
