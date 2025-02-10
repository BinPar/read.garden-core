import type { SelectionOption } from '@/@types/selection';
import setupSelectionMenu from '@/utils/setupSelectionMenu';
import { getState } from '@/utils/state';

const showSelectionMenu = (
  options?: SelectionOption[],
  id?: string | number,
  deleteOption?: boolean | string,
) => {
  if (options?.length) {
    setupSelectionMenu(options, id, deleteOption);
  }

  const state = getState();
  state.container.classList.add('selection-mode');
};

export default showSelectionMenu;
