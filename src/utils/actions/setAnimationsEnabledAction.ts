import type { ActionHandler, SetAnimationsEnabled } from '@/@types/actions';
import setAnimationsEnabled from '@/utils/setAnimationsEnabled';

const setAnimationsEnabledAction: ActionHandler<SetAnimationsEnabled> = ({
  action,
}) => {
  setAnimationsEnabled(action.animationsEnabled);
};

export default setAnimationsEnabledAction;
