import type { FitMode } from '@/@types/common';
import type { UIOptions } from '@/@types/config';
import setFitMode from '@/utils/fixed/setFitMode';
import zoomIn from '@/utils/fixed/zoomIn';
import zoomOut from '@/utils/fixed/zoomOut';
import decreaseFont from '@/utils/flow/decreaseFont';
import increaseFont from '@/utils/flow/increaseFont';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const render = (
  buttons: Required<UIOptions>['buttons'],
  state = getState(),
) => {
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
        const prop = typeof button === 'string' ? undefined : button.prop;
        const value = typeof button === 'string' ? undefined : button.value;
        domButton.classList.add('button');
        domButton.addEventListener('pointerdown', (event) => {
          console.log('ui button pointerdown');
          if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation();
            if (prop && value) {
              updateState({ [prop]: value });
            } else {
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

              if (type === 'increaseFont') {
                increaseFont();
              }

              if (type === 'decreaseFont') {
                decreaseFont();
              }

              if (type === 'setFitMode') {
                setFitMode(value as FitMode);
              }
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
