import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

const increaseFont = () => {
  const state = getState();
  const config = getConfig();

  if (state.layout === 'fixed' || config.layout === 'fixed') {
    return;
  }
  
  const newValue = Math.min(
    state.fontSize + config.fontSizeStep,
    config.maxFontSize,
  );
  if (newValue !== state.fontSize) {
    updateState({
      fontSize: newValue,
    });
  }
};

export default increaseFont;
