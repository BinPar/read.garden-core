import type { Button, ButtonType } from '@/@types/buttons';
import zoomIn from '@/utils/fixed/zoomIn';
import zoomOut from '@/utils/fixed/zoomOut';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

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
        domButton.addEventListener('pointerdown', (event) => {
          console.log('ui button pointerdown');
          if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation();
            if (type === 'forward') {
              moveForward();
            }

            if (type === 'backward') {
              moveBackwards();
            }

            if (type === 'switchMode') {
              switchMode();
            }

            if (type === 'zoomIn') {
              zoomIn();
            }

            if (type === 'zoomOut') {
              zoomOut();
            }
          }
        });
        uiContainer.append(domButton);
      }
    }
    state.container.appendChild(uiContainer);
    uiContainer.addEventListener('pointerdown', (ev) => {
      console.log('ui pointerdown');
      ev.stopPropagation();
    });
    updateState({ uiContainer });
  }
};

export default render;
