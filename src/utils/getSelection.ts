import { getState } from '@/utils/state';

const getSelection = (): Selection | null => {
  const state = getState();
  if (state.win.getSelection) {
    return state.win.getSelection();
  }
  if (state.doc.getSelection) {
    return state.doc.getSelection();
  }
  return null;
};

export default getSelection;
