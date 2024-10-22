import { z } from 'zod';

import { fixedAction, fixedActionType } from '@/types/actions/fixed';
import { flowAction, flowActionType } from '@/types/actions/flow';

export const commonActionType = z.enum(['goForward', 'goBackward']);

export const actionType = z.union([
  commonActionType,
  fixedActionType,
  flowActionType,
]);

export const commonAction = z
  .object({
    type: commonActionType,
  })
  .and(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal(commonActionType.Values.goForward),
        payload: z.boolean(),
      }),
      z.object({
        type: z.literal(commonActionType.Values.goBackward),
        payload: z.string(),
      }),
    ]),
  );

export const action = commonAction.or(fixedAction).or(flowAction);

export type ActionType = z.infer<typeof actionType>;
export type CommonAction = z.infer<typeof commonAction>;
export type Action = z.infer<typeof action>;
