import type { ActionHandler, SetBrightness } from '@/@types/actions';
import setBrightness from '@/utils/setBrightness';


const setBrightnessAction: ActionHandler<SetBrightness> = (params) => {
  setBrightness(params.action.brightness);
};

export default setBrightnessAction;
