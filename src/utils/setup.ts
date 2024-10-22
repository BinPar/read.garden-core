import {
  options,
  type CommonConfig,
  type Config,
  type FixedConfig,
  type FlowConfig,
  type Options,
} from '@/types/config';

import render from '@/utils/buttons/render';

const setup = (initialOptions: Options): Config => {
  const res = options.safeParse(initialOptions);

  if (!res.success) {
    throw new Error(
      `Invalid config with following error(s):\n${JSON.stringify(res.error.issues)}`,
    );
  }

  const commonConfig: CommonConfig = {
    buttons: res.data.options.buttons,
  };

  if (commonConfig.buttons?.length) {
    render(commonConfig.buttons);
  }

  if (res.data.layout === 'flow') {
    const flowConfig: FlowConfig = {
      fontSize: res.data.options.fontSize,
    };

    return {
      layout: 'flow',
      ...commonConfig,
      ...flowConfig,
    };
  }

  if (res.data.layout === 'fixed') {
    const fixedConfig: FixedConfig = {
      fit: res.data.options.fit,
    };

    return {
      layout: 'fixed',
      ...commonConfig,
      ...fixedConfig,
    };
  }

  throw new Error('Invalid layout');
};

export default setup;