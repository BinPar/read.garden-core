import { z } from 'zod';

import { fixedOptions } from '@/types/config/fixed';
import { flowOptions } from '@/types/config/flow';
import { button } from '@/types/buttons';

export const layout = z.enum(['fixed', 'flow']);
export const direction = z.enum(['horizontal', 'vertical']);

export const config = z.object({
  layout,
  buttons: z.array(button).optional(),
});

export const commonOptions = z.object({
  direction: direction.optional().default('horizontal'),
  buttons: config.shape.buttons.optional(),
});

export const options = z.union([
  z.object({
    layout: z.literal(layout.Values.fixed),
    options: commonOptions.merge(fixedOptions),
  }),
  z.object({
    layout: z.literal(layout.Values.flow),
    options: commonOptions.merge(flowOptions),
  }),
]);

export type Layout = z.infer<typeof layout>;
export type Config = z.infer<typeof config>;
export type Options = z.infer<typeof options>;
