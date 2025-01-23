import type { SelectionOption } from '@/@types/selection';
import { getConfig } from '@/utils/config';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import { getState } from '@/utils/state';

const showSelectionMenu = (options?: SelectionOption[]) => {
  const config = getConfig();
  const menuOptions = options ?? config.selectionMenuOptions;
  console.log({ menuOptions });
  if (!menuOptions?.length) {
    return;
  }

  const state = getState();
  state.selectionMenu.innerHTML = '';

  for (let i = 0, l = menuOptions.length; i < l; i++) {
    const option = menuOptions[i];
    if (option) {
      const button = state.doc.createElement('button');
      button.title = option.title;
      button.innerText = option.title;
      if (option.className) {
        button.classList.add(option.className);
      }
      if (option.style) {
        button.setAttribute('style', option.style);
      }
      button.addEventListener('click', () => {
        console.log('option selected');
        hideSelectionMenu();
      });
      state.selectionMenu.appendChild(button);
    }
  }
  state.doc.body.classList.add('selection-mode');
};

export default showSelectionMenu;
