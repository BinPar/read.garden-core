import type { ActionHandler, SetFitMode } from '@/@types/actions';
import setFitMode from '@/utils/fixed/setFitMode';

const setFitModeAction: ActionHandler<SetFitMode> = ({ action }) => {
  setFitMode(action.fitMode);
};

export default setFitModeAction;
