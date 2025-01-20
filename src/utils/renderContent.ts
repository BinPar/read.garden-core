import { getState } from '@/utils/state';

const renderContent = (html: string, state = getState()) => {
  state.content.innerHTML = html;

  if (state.layout === 'flow') {
    const chapterStart = state.doc.createElement('div');
    chapterStart.id = 'chapter-start';
    state.content.insertAdjacentElement('beforebegin', chapterStart);
  
    const inlineEnd = state.doc.createElement('div');
    inlineEnd.id = 'inline-end';
    state.content.insertAdjacentElement('beforeend', inlineEnd);
  
    const chapterEnd = state.doc.createElement('div');
    chapterEnd.id = 'chapter-end';
    state.content.insertAdjacentElement('afterend', chapterEnd);
  }
};

export default renderContent;
