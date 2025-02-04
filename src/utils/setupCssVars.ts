import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';

const setupCssVars = (config = getConfig()) => {
  setCssVariable('viewer-margin-top', '200svh');
  setCssVariable('ui-scale', `${config.uiModeScale}`);
  setCssVariable('ui-left', `${config.uiModeLeft}px`);
  setCssVariable('ui-top', `${config.uiModeTop}px`);

  if (config.layout === 'flow') {
    setCssVariable('scroll-behavior', 'auto');
    setCssVariable('scroll-snap-type', 'x mandatory');
    setCssVariable('flow-left-threshold', '0');
    setCssVariable('flow-right-threshold', '0');
    setCssVariable('font-family', config.fontFamily);
    setCssVariable('font-size', `${config.fontSize}px`);
    setCssVariable('line-height', `${config.lineHeight}`);
    if (config.textAlign) {
      setCssVariable('text-align', config.textAlign);
    }
  }

  if (config.padding) {
    setCssVariable('padding-top', `${config.padding.top}px`);
    setCssVariable('padding-bottom', `${config.padding.bottom}px`);
    setCssVariable('padding-left', `${config.padding.left}px`);
    setCssVariable('padding-right', `${config.padding.right}px`);
  }
};

export default setupCssVars;
