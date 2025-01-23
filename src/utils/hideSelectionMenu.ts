import { getState } from '@/utils/state';

const hideSelectionMenu = () => {
  const state = getState();
  state.doc.body.classList.remove('selection-mode');
};

export default hideSelectionMenu;