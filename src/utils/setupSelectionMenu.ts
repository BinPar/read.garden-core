import type { SelectionOption } from '@/@types/selection';
import dispatch from '@/utils/dispatch';
import dispatchEvent from '@/utils/events/dispatchEvent';
import getCurrentHighlight from '@/utils/getCurrentHighlight';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import renderCurrentHighlight from '@/utils/renderCurrentHighlight';
import { getState, updateState } from '@/utils/state';

function setupSelectionMenu(
  options: SelectionOption[],
  id?: string | number,
  deleteOption?: boolean | string,
) {
  const state = getState();
  state.selectionMenu.innerHTML = '';

  if (deleteOption && id) {
    const button = state.doc.createElement('button');
    const title = typeof deleteOption === 'string' ? deleteOption : 'Delete';
    button.title = title;
    button.innerText = title;
    button.classList.add('delete');

    button.addEventListener('pointerdown', preventAndStopPropagation);
    button.addEventListener('pointerup', (event) => {
      preventAndStopPropagation(event);
      dispatchEvent({
        type: 'onHighlightRemove',
        id,
      });
      dispatch({
        type: 'removeHighlights',
        ids: [id],
      });
      hideSelectionMenu();
    });
    button.addEventListener('click', preventAndStopPropagation);
    button.addEventListener('pointercancel', preventAndStopPropagation);

    state.selectionMenu.appendChild(button);
  }

  for (let i = 0, l = options.length; i < l; i++) {
    const option = options[i];
    // oculultar nota cuando se tiene una seleccion activa
    if (id && option?.type === 'note') continue;

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

      button.addEventListener('pointerdown', preventAndStopPropagation);
      button.addEventListener('pointerup', (event) => {
        preventAndStopPropagation(event);

        if (id) {
          const domHighlights = state.domHighlightsById.get(id);
          if (domHighlights) {
            for (let j = 0, k = domHighlights.length; j < k; j++) {
              const domHighlight = domHighlights[j];
              if (domHighlight) {
                domHighlight.style.setProperty(
                  '--highlighter-color',
                  option.color,
                );
                domHighlight.style.setProperty(
                  'display',
                  `var(--highlighter-${option.key}-display, block)`,
                );
                // Mantener coherente el dataset
                domHighlight.dataset.highlighter = `${option.key}`;
              }
            }
          }

          // Sincronizar el estado persistente para futuros redraws
          const existing = state.userHighlightsById.get(id);
          if (existing) {
            state.userHighlightsById.set(id, {
              ...existing,
              color: option.color,
              highlighter: option.key,
            });
          }

          dispatchEvent({
            type: 'onHighlightEdit',
            id,
            highlighter: option.key,
          });
          hideSelectionMenu();
        } else {
          if (option.type === 'highlighter') {
            renderCurrentHighlight({
              highlighter: option.key,
              color: option.color,
              type: option.type,
            });
          }
          if (option.type === 'note' && state.currentSelection) {
            updateState({
              currentHighlight: getCurrentHighlight({
                ...state.currentSelection,
                highlighter: option.key,
                color: option.color,
                type: option.type,
              }),
              currentSelection: null,
            });
          }
        }
      });
      button.addEventListener('click', preventAndStopPropagation);
      button.addEventListener('pointercancel', preventAndStopPropagation);
      state.selectionMenu.appendChild(button);
    }
  }
}

export default setupSelectionMenu;
