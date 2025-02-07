import { getConfig } from '@/utils/config';
import { updateState } from '@/utils/state';

const setFontFamily = (fontFamily: string) => {
  const config = getConfig();

  if (config.layout !== 'flow') {
    return;
  }

  if (!config.fontFamilies.includes(fontFamily)) {
    console.warn(`Unknown font family: ${fontFamily}`);
    return;
  }

  updateState({ fontFamily });
};

export default setFontFamily;
