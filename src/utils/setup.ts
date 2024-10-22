import {
  options as optionsSchema,
  type Config,
  type Options,
} from '@/types/config';
import render from '@/utils/buttons/render';

const setup = (options: Options) => {
  const res = optionsSchema.safeParse(options);

  if (!res.success) {
    throw new Error(
      `Invalid config with following error(s):\n${res.error.errors.join('\n')}`,
    );
  }

  const config: Config = {
    layout: res.data.layout,
    buttons: res.data.options.buttons,
  };

  if (config.buttons?.length) {
    render(config.buttons);
  }

  return config;
};

export default setup;
