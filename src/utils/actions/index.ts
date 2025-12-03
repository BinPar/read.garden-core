import type { Actions } from '@/@types/actions';

import addOnChangeEvent from '@/utils/actions/addOnChangeEvent';
import cancelHighlight from '@/utils/actions/cancelHighlight';
import confirmHighlight from '@/utils/actions/confirmHighlight';
import decreaseFontSize from '@/utils/actions/decreaseFontSize';
import drawHighlights from '@/utils/actions/drawHighlights';
import increaseFontSize from '@/utils/actions/increaseFontSize';
import moveNext from '@/utils/actions/moveNext';
import movePrev from '@/utils/actions/movePrev';
import navigateToPage from '@/utils/actions/navigateToPage';
import removeHighlights from '@/utils/actions/removeHighlights';
import setFitMode from '@/utils/actions/setFitModeAction';
import setFontFamily from '@/utils/actions/setFontFamily';
import setLineHeight from '@/utils/actions/setLineHeight';
import setPageLayout from '@/utils/actions/setPageLayoutAction';
import setTextAlign from '@/utils/actions/setTextAlign';
import setTheme from '@/utils/actions/setTheme';
import showSelectionMenu from '@/utils/actions/showSelectionMenu';
import setAnimationsEnabled from '@/utils/actions/setAnimationsEnabledAction';

const actions: Actions = {
  setTheme,
  drawHighlights,
  removeHighlights,
  moveNext,
  movePrev,
  addOnChangeEvent,
  increaseFontSize,
  decreaseFontSize,
  setFontFamily,
  setTextAlign,
  setLineHeight,
  navigateToPage,
  confirmHighlight,
  cancelHighlight,
  showSelectionMenu,
  setFitMode,
  setPageLayout,
  setAnimationsEnabled,
};

export default actions;
