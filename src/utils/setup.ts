import isTouchDevice from '@/tools/isTouchDevice';
import {
  defaultDirection,
  options,
  type CommonConfig,
  type Config,
  type FixedConfig,
  type Options,
} from '@/@types/config';

import render from '@/utils/buttons/render';
import flowSetup from '@/utils/flow/setup';
import setupDomEvents from '@/utils/setupDomEvents';

const setup = (initialOptions: Options): Config => {
  const res = options.safeParse(initialOptions);

  if (!res.success) {
    throw new Error(
      `Invalid config with following error(s):\n${res.error.toString()}`,
    );
  }

  setupDomEvents();

  const commonConfig: CommonConfig = {
    buttons: res.data.options.buttons,
    touch: res.data.options.touch ?? isTouchDevice(),
    direction: res.data.options.direction ?? defaultDirection,
  };

  if (commonConfig.buttons?.length) {
    const uiContainer = document.createElement('div');
    uiContainer.id = 'rg-ui-container';
    document.body.append(uiContainer);

    render(commonConfig.buttons, uiContainer);
  }

  if (res.data.layout === 'flow') {
    const flowConfig = flowSetup(res.data.options);

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
