import type { FitMode } from '@/@types/common';
import type { UIOptions } from '@/@types/config';
import setFitMode from '@/utils/fixed/setFitMode';
import zoomIn from '@/utils/fixed/zoomIn';
import zoomOut from '@/utils/fixed/zoomOut';
import decreaseFont from '@/utils/flow/decreaseFont';
import increaseFont from '@/utils/flow/increaseFont';
import setFontFamily from '@/utils/flow/setFontFamily';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import navigateToContentSlug from '@/utils/navigateToContentSlug';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const render = (options?: UIOptions, isEReader?: boolean) => {
  if (!options?.buttons?.length && !options?.pageSelect) {
    return;
  }

  const state = getState();

  const uiContainer = state.doc.createElement('div');
  if (!isEReader) {
    uiContainer.style.transition = 'top var(--animation-delay)';
  }
  uiContainer.id = 'ui-container';
  if (options.buttons) {
    for (let i = 0; i < options.buttons.length; i++) {
      const button = options.buttons[i];
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
          if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation();
            if (prop && value !== undefined) {
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

              if (type === 'setFontFamily') {
                setFontFamily(value as string);
              }
            }
          }
        });
        uiContainer.append(domButton);
      }
    }
  }

  if (options.pageSelect && state.contentsBySlug) {
    const slugs = Array.from(state.contentsBySlug.keys());
    if (slugs.length) {
      const select = state.doc.createElement('select');
      for (let i = 0, l = slugs.length; i < l; i++) {
        const slug = slugs[i];
        if (slug) {
          const label = state.labelBySlug?.get(slug) ?? slug;
          const option = state.doc.createElement('option');
          option.value = slug;
          option.textContent = label;
          select.appendChild(option);
        }
      }
      select.onchange = () => {
        const value = select.value;
        if (value) {
          navigateToContentSlug(value);
        }
      };
      uiContainer.appendChild(select);
    }
  }

  state.container.appendChild(uiContainer);
  uiContainer.addEventListener('pointerdown', preventAndStopPropagation);
  updateState({ uiContainer });
};

export default render;
