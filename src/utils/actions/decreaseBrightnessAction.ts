import type { ActionHandler, DecreaseBrightness } from '@/@types/actions';
import decreaseBrightness from '@/utils/decreaseBrightness';

const decreaseBrightnessAction: ActionHandler<DecreaseBrightness> = () => {
  decreaseBrightness();
};

export default decreaseBrightnessAction;
