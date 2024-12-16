import { z } from 'zod';

import { fixedConfig, fixedOptions } from '@/types/config/fixed';
import { flowConfig, flowOptions } from '@/types/config/flow';
import { button } from '@/types/buttons';

const layout = z.enum(['fixed', 'flow']);
const direction = z.enum(['horizontal', 'vertical']);
const touch = z.boolean();
const buttons = z.array(button).optional();

const commonConfig = z.object({
  buttons,
  touch,
  direction,
});

export const config = commonConfig.and(
  z.discriminatedUnion('layout', [
    fixedConfig.extend({ layout: z.literal(layout.Values.fixed) }),
    flowConfig.extend({ layout: z.literal(layout.Values.flow) }),
  ]),
);

export const commonOptions = z.object({
  direction: direction.optional(),
  touch: touch.optional(),
  buttons,
});

export const options = z.discriminatedUnion('layout', [
  z.object({
    layout: z.literal(layout.Values.fixed),
    options: commonOptions.merge(fixedOptions),
  }),
  z.object({
    layout: z.literal(layout.Values.flow),
    options: commonOptions.merge(flowOptions),
  }),
]);

export const defaultDirection = direction.Values.horizontal;

export type FlowConfig = z.output<typeof flowConfig>;
export type FlowOptionsInput = z.input<typeof flowOptions>;
export type FlowOptionsOutput = z.output<typeof flowOptions>;

export type FixedConfig = z.output<typeof fixedConfig>;
export type FixedOptionsInput = z.input<typeof fixedOptions>;
export type FixedOptionsOutput = z.output<typeof fixedOptions>;

export type Layout = z.infer<typeof layout>;
export type Options = z.input<typeof options>;
export type CommonConfig = z.output<typeof commonConfig>;
export type Config = z.output<typeof config>;
