import { getState } from '@/utils/state';

const getSelection = (): Selection => {
  const state = getState();
  let selection: Selection | null = null;
  if (state.win.getSelection) {
    selection = state.win.getSelection();
  }
  if (!selection && state.doc.getSelection) {
    selection = state.doc.getSelection();
  }
  if (!selection) {
    throw new Error('No selection');
  }
  return selection;
};

export default getSelection;
