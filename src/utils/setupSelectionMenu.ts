import type { SelectionOption } from '@/@types/selection';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import renderHighlight from '@/utils/renderHighlight';
import { getState } from '@/utils/state';

const setupSelectionMenu = (options: SelectionOption[]) => {
  const state = getState();
  state.selectionMenu.innerHTML = '';

  for (let i = 0, l = options.length; i < l; i++) {
    const option = options[i];
    if (option) {
      const button = state.doc.createElement('button');
      button.title = option.title;
      button.innerText = option.title;
      button.classList.add(option.type);
      if (option.selected) {
        button.ariaSelected = 'true';
        button.classList.add('selected');
      }
      if (option.className) {
        button.classList.add(option.className);
      }
      if (option.style) {
        button.setAttribute('style', option.style);
      }
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('selection button pointerdown');
        renderHighlight({
          highlighter: option.key,
          color: option.color,
          type: option.type,
        });
      });
      button.addEventListener('pointerup', preventAndStopPropagation);
      button.addEventListener('pointercancel', preventAndStopPropagation);
      state.selectionMenu.appendChild(button);
    }
  }
};

export default setupSelectionMenu;
