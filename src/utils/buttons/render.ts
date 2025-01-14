import type { Button, ButtonType } from '@/@types/buttons';
import { getState, updateState } from '@/utils/state';

const render = (buttons: ButtonType[] | Button[], state = getState()) => {
  if (buttons.length) {
    const uiContainer = state.doc.createElement('div');
    uiContainer.id = 'ui-container';
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button) {
        const domButton = document.createElement('button');
        const type = typeof button === 'string' ? button : button.type;
        const text =
          (typeof button === 'string' ? button : button.text) ?? type;
        domButton.innerHTML = text;
        const title = typeof button === 'string' ? undefined : button.title;
        if (title) {
          domButton.title = title;
        }
        domButton.classList.add('button');
        domButton.addEventListener('pointerdown', (ev) => {
          if (ev.button === 0) {
            if (type === 'forward') {
              document.body.scrollBy({
                left: document.body.clientWidth,
                behavior: 'instant',
              });
            }

            if (type === 'backward') {
              document.body.scrollBy({
                left: -document.body.clientWidth,
                behavior: 'instant',
              });
            }

            if (type === 'switchMode') {
              state.container.classList.toggle('ui-mode');
            }
          }
        });
        uiContainer.append(domButton);
      }
    }
    state.viewer.appendChild(uiContainer);
    updateState({ uiContainer });
  }
};

export default render;
