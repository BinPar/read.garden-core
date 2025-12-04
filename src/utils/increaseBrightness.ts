import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

const increaseBrightness = () => {
  const state = getState();
  const config = getConfig();

  const newValue = Math.min(
    state.brightness + config.brightnessStep,
    config.maxBrightness,
  );
  updateState({
    brightness: newValue,
  });
};

export default increaseBrightness;
