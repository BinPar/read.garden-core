import type { Actions } from '@/@types/actions';
import createHighlight from '@/utils/actions/createHighlight';
import drawHighlights from '@/utils/actions/drawHighlights';
import moveNext from '@/utils/actions/moveNext';
import movePrev from '@/utils/actions/movePrev';

const actions: Actions = {
  createHighlight,
  drawHighlights,
  moveNext,
  movePrev,
};

export default actions;
