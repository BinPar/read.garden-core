import type { SelectionOption } from '@/@types/selection';
import setupSelectionMenu from '@/utils/setupSelectionMenu';
import { getState } from '@/utils/state';

const showSelectionMenu = (options?: SelectionOption[]) => {
  if (options?.length) {
    setupSelectionMenu(options);
  }

  const state = getState();
  state.container.classList.add('selection-mode');
};

export default showSelectionMenu;
