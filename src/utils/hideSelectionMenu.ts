import { getState } from '@/utils/state';

const hideSelectionMenu = () => {
  const state = getState();
  window.setTimeout(() => {
    state.container.classList.remove('selection-mode');
  }, 0);
};

export default hideSelectionMenu;
