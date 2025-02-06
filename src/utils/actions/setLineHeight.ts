import type { ActionHandler, SetLineHeight } from '@/@types/actions';
import lineHeightSetter from '@/utils/flow/setLineHeight';

const setLineHeight: ActionHandler<SetLineHeight> = ({ action }) => {
  lineHeightSetter(action.lineHeight);
};

export default setLineHeight;
