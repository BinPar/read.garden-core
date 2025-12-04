import type { ActionHandler, IncreaseBrightness } from '@/@types/actions';
import increaseBrightness from '@/utils/increaseBrightness';

const increaseBrightnessAction: ActionHandler<IncreaseBrightness> = () => {
  increaseBrightness();
};

export default increaseBrightnessAction;
