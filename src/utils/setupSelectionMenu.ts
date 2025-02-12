import type { SelectionOption } from '@/@types/selection';
import dispatchEvent from '@/utils/events/dispatchEvent';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import renderCurrentHighlight from '@/utils/renderCurrentHighlight';
import showNoteMenu from '@/utils/showNoteMenu';
import { getState, updateState } from '@/utils/state';

const setupSelectionMenu = (
  options: SelectionOption[],
  id?: string | number,
  deleteOption?: boolean | string,
) => {
  const state = getState();
  state.selectionMenu.innerHTML = '';

  if (deleteOption && id) {
    const button = state.doc.createElement('button');
    const title = typeof deleteOption === 'string' ? deleteOption : 'Delete';
    button.title = title;
    button.innerText = title;
    button.classList.add('delete');

    button.addEventListener('pointerdown', (event) => {
      preventAndStopPropagation(event);
      dispatchEvent({
        type: 'onHighlightRemove',
        id,
      });
      const highlights = state.domHighlightsById.get(id);
      if (highlights) {
        for (let i = 0, l = highlights.length; i < l; i++) {
          const highlight = highlights[i];
          if (highlight) {
            highlight.remove();
          }
        }
      }
      hideSelectionMenu();
    });

    button.addEventListener('pointerup', preventAndStopPropagation);
    button.addEventListener('pointercancel', preventAndStopPropagation);

    state.selectionMenu.appendChild(button);
  }

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
      button.setAttribute('style', `--highlighter-color: ${option.color}`);

      button.addEventListener('pointerdown', (event) => {
        preventAndStopPropagation(event);
        console.log('selection button pointerdown', id);

        if (id) {
          const highlights = state.domHighlightsById.get(id);
          if (highlights) {
            for (let j = 0, k = highlights.length; j < k; j++) {
              const highlight = highlights[j];
              if (highlight) {
                highlight.style.setProperty('--highlighter-color', option.color);
                highlight.style.setProperty(
                  'display',
                  `var(--highlighter-${option.key}-display, block)`,
                );
              }
            }
          }
          dispatchEvent({
            type: 'onHighlightEdit',
            id,
            highlighter: option.key,
          });
          hideSelectionMenu();
        } else {
          if (option.type === 'highlight') {
            renderCurrentHighlight({
              highlighter: option.key,
              color: option.color,
              type: option.type,
            });
          }
          if (option.type === 'note') {
            updateState({
              addingNote: true,
            });
            showNoteMenu({
              highlighter: option.key,
              color: option.color,
            });
          }
        }
      });
      button.addEventListener('pointerup', preventAndStopPropagation);
      button.addEventListener('pointercancel', preventAndStopPropagation);
      state.selectionMenu.appendChild(button);
    }
  }
};

export default setupSelectionMenu;
