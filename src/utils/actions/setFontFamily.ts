import type { ActionHandler, SetFontFamily } from '@/@types/actions';
import fontFamilySetter from '@/utils/flow/setFontFamily';

const setFontFamily: ActionHandler<SetFontFamily> = ({ action }) => {
  fontFamilySetter(action.fontFamily);
};

export default setFontFamily;
