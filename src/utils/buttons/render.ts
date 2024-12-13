import type { Button } from '@/types/buttons';

const render = (buttons: Button[], uiContainer: HTMLDivElement) => {
  if (buttons.length) {
    const container = document.createElement('div');
    container.id = 'rg-buttons-container';
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button) {
        const domButton = document.createElement('button');
        domButton.textContent = button.text ?? '';
        domButton.classList.add('rg-button');
        domButton.addEventListener('pointerdown', (ev) => {
          if (ev.button === 0) {
            if (button.type === 'forward') {
              document.body.scrollBy({
                left: document.body.clientWidth,
                behavior: 'instant',
              });
            }

            if (button.type === 'backward') {
              document.body.scrollBy({
                left: -document.body.clientWidth,
                behavior: 'instant',
              });
            }
          }
        });
        container.append(domButton);
      }
    }
    uiContainer.append(container);
  }
};

export default render;
