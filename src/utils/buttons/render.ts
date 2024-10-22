import type { Button } from '@/types/buttons';

const render = (buttons: Button[]) => {
  if (buttons.length) {
    const container = document.createElement('div');
    container.classList.add('rg-buttons-container');
    for (let i = 0; i < buttons.length; i++) {
      const option = buttons[i];
      if (option) {
        const btn = document.createElement('button');
        btn.textContent = option.text ?? '';
        btn.classList.add('rg-button');
        btn.addEventListener('pointerdown', (ev) => {
          if (ev.button === 0) {
            document.body.scrollLeft += document.body.clientWidth;
          }
        });
        container.append(btn);
      }
    }
    document.body.append(container);
  }
};

export default render;
