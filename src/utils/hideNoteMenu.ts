import { getState, updateState } from '@/utils/state';

const hideMenuNote = () => {
  const state = getState();
  state.container.classList.remove('note-mode');
  updateState({ addingNote: false });
};

export default hideMenuNote;
