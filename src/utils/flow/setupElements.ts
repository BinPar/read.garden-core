import type setupDomElements from '@/utils/setupDomElements';

const setupElements = (initialState: ReturnType<typeof setupDomElements>) => {
  const chapterStart = initialState.doc.createElement('div');
  chapterStart.id = 'chapter-start';
  initialState.content.insertAdjacentElement('beforebegin', chapterStart);

  const chapterEnd = initialState.doc.createElement('div');
  chapterEnd.id = 'chapter-end';
  initialState.content.insertAdjacentElement('afterend', chapterEnd);

  const snapsContainer = initialState.doc.createElement('div');
  snapsContainer.id = 'snaps-container';
  initialState.wrapper.appendChild(snapsContainer);

  return {
    chapterStart,
    chapterEnd,
    snapsContainer,
  };
};

export default setupElements;
