import { getState } from '@/utils/state';

const hideSelectionMenu = () => {
  const state = getState();
  state.container.classList.remove('selection-mode');
};

export default hideSelectionMenu;