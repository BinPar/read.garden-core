import { getState } from '@/utils/state';

const hideMenuNote = () => {
  const state = getState();
  state.container.classList.remove('note-mode');
};

export default hideMenuNote;
