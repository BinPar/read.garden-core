import { z } from 'zod';

import { fixedConfig, fixedOptions } from '@/types/config/fixed';
import { flowConfig, flowOptions } from '@/types/config/flow';
import { button } from '@/types/buttons';

export const layout = z.enum(['fixed', 'flow']);
export const direction = z.enum(['horizontal', 'vertical']);
export const touch = z.boolean();
export const buttons = z.array(button).optional();

export const commonConfig = z.object({
  buttons,
  touch,
});

export const config = z
  .object({
    buttons,
  })
  .and(
    z.union([
      fixedConfig.extend({ layout: z.literal(layout.Values.fixed) }),
      flowConfig.extend({ layout: z.literal(layout.Values.flow) }),
    ]),
  );

export const commonOptions = z.object({
  direction: direction.optional(),
  touch: touch.optional(),
  buttons,
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

export type CommonConfig = z.output<typeof commonConfig>;
export type FlowConfig = z.output<typeof flowConfig>;
export type FixedConfig = z.output<typeof fixedConfig>;
export type Config = z.output<typeof config>;

export type Options = z.input<typeof options>;

const testFlowOptions: Options = {
  layout: 'flow',
  options: {},
};

const testFixedOptions: Options = {
  layout: 'fixed',
  options: {},
};

const testFlowConfig: Config = {
  layout: 'flow',
  fontSize: 12,
};

const testFixedConfig: Config = {
  layout: 'fixed',
  // fit: 'page',
};

console.log({
  testFlowOptions,
  testFixedOptions,
  testFlowConfig,
  testFixedConfig,
});
