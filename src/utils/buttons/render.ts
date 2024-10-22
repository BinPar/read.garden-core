import type { Button } from '@/types/buttons';

const render = (buttons: Button[]) => {

    if(buttons.length) {
        const container = document.createElement('div');
        container.classList.add('buttonsContainer');
        console.log(' Estoy en el renderer')
      
        const firstBtn = document.createElement('button');
        const secondBtn = document.createElement('button');
        container.append(firstBtn);
        container.append(secondBtn);
        firstBtn.textContent = 'BTN1';
        secondBtn.textContent = 'BTN2';
        document.body.append(container);
    }
};

export default render;
