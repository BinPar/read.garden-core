import type { ActionHandler, SetTextAlign } from '@/@types/actions';
import textAlignSetter from '@/utils/flow/setTextAlign';

const setTextAlign: ActionHandler<SetTextAlign> = ({ action }) => {
  textAlignSetter(action.textAlign);
};

export default setTextAlign;
