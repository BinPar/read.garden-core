import type { Button } from '@/types/buttons';

const render = (buttons: Button[]) => {
  if (buttons.length) {
    const container = document.createElement('div');
    container.classList.add('rg-buttons-container');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button) {
        const domButton = document.createElement('button');
        domButton.textContent = button.text ?? '';
        domButton.classList.add('rg-button');
        domButton.addEventListener('pointerdown', (ev) => {
          if (ev.button === 0) {
            if (button.type === 'forward') {
              document.body.querySelector('#container')?.scrollBy({
                left: document.body.clientWidth,
                behavior: 'instant',
              });
            }

            if (button.type === 'backward') {
              document.body.querySelector('#container')?.scrollBy({
                left: -document.body.clientWidth,
                behavior: 'instant',
              });
            }
          }
        });
        container.append(domButton);
      }
    }
    document.body.append(container);
  }
};

export default render;
