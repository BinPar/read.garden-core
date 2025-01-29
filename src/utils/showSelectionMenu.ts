import type { SelectionOption } from '@/@types/selection';
import { getConfig } from '@/utils/config';
import dispatch from '@/utils/dispatch';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
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
      button.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        console.log('selection button pointerdown');
        dispatch({
          type: 'createHighlight',
          payload: {
            key: option.key,
            color: option.color,
            clearSelection: true,
            hideMenu: true,
            draw: true,
          },
        });
      });
      button.addEventListener('pointerup', preventAndStopPropagation);
      button.addEventListener('pointercancel', preventAndStopPropagation);
      state.selectionMenu.appendChild(button);
    }
  }

  state.container.classList.add('selection-mode');
};

export default showSelectionMenu;
