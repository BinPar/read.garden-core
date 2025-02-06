import type { Actions } from '@/@types/actions';

import addOnChangeEvent from '@/utils/actions/addOnChangeEvent';
import createHighlight from '@/utils/actions/createHighlight';
import decreaseFontSize from '@/utils/actions/decreaseFontSize';
import drawHighlights from '@/utils/actions/drawHighlights';
import increaseFontSize from '@/utils/actions/increaseFontSize';
import moveNext from '@/utils/actions/moveNext';
import movePrev from '@/utils/actions/movePrev';
import navigateToPage from '@/utils/actions/navigateToPage';
import setFontFamily from '@/utils/actions/setFontFamily';
import setLineHeight from '@/utils/actions/setLineHeight';
import setTextAlign from '@/utils/actions/setTextAlign';
import setTheme from '@/utils/actions/setTheme';

const actions: Actions = {
  setTheme,
  createHighlight,
  drawHighlights,
  moveNext,
  movePrev,
  addOnChangeEvent,
  increaseFontSize,
  decreaseFontSize,
  setFontFamily,
  setTextAlign,
  setLineHeight,
  navigateToPage,
};

export default actions;
