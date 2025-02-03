import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

const decreaseFont = () => {
  const state = getState();
  const config = getConfig();
  if (state.layout === 'fixed' || config.layout === 'fixed') {
    return;
  }
  const newValue = Math.max(
    state.fontSize - config.fontSizeStep,
    config.minFontSize,
  );
  if (newValue !== state.fontSize) {
    updateState({
      fontSize: newValue,
    });
  }
};

export default decreaseFont;
