import type { Button } from '@/types/buttons';

const render = (buttons: Button[]) => {
    if (buttons.length) {
        const container = document.createElement('div');
        container.classList.add('buttonsContainer');
        for(let i = 0; i < buttons.length; i++ ) {
        const option = buttons[i]; 
        const btn = document.createElement('button');
        container.append(btn);
        btn.textContent = option?.text || '';
        btn.classList.add('defaultButtonStyle');
        btn.onclick = () => {
            console.log(`Acabas de pulsar un botón con el titulo: ${option?.text || ''}`);
        }
        
    }
    document.body.append(container);
  }
};

export default render;
