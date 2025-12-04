import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

const decreaseBrightness = () => {
  const state = getState();
  const config = getConfig();

  const newValue = Math.max(
    state.brightness - config.brightnessStep,
    config.minBrightness,
  );
  updateState({
    brightness: newValue,
  });
};

export default decreaseBrightness;

