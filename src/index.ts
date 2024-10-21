import getMockContentLines from '@/lib/getMockContentLines';

const mockLines = getMockContentLines(10);
const contents = 100;

window.onload = () => {
  for (let i = 0; i < contents; i++) {
    const div = document.createElement('div');
    mockLines.forEach((p) => {
      const pEl = document.createElement('p');
      pEl.textContent = p;
      div.appendChild(pEl);
    });
    document.body.appendChild(div);
  }
};
