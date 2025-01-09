import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';

const setupCssVars = (config = getConfig()) => {
  // setCssVariable('viewer-margin-top', '200vh');

  if (config.layout === 'flow') {
    setCssVariable('padding-top', `${config.padding.top}px`);
    setCssVariable('padding-bottom', `${config.padding.bottom}px`);
  }
}

export default setupCssVars;
