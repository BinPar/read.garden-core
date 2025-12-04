import { getConfig } from '@/utils/config';
import { updateState } from '@/utils/state';

const setBrightness = (brightness: number) => {
  const config = getConfig();
  let newValue = brightness;

  if (brightness < config.minBrightness) {
    newValue = config.minBrightness;
  }
  if (brightness > config.maxBrightness) {
    newValue = config.maxBrightness;
  }
  updateState({
    brightness: newValue,
  });
};

export default setBrightness;
