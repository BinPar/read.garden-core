import { getConfig } from '@/utils/config';
import { getState } from '@/utils/state';

const getScale = () => {
  const state = getState();
  if (state.layout === 'fixed') {
    return state.zoom / 100;
  }

  if (state.readMode || !state.animationsEnabled) {
    return 1;
  }
  const config = getConfig();
  return config.uiModeScale;
};

export default getScale;
