import type setupDomElements from '@/utils/setupDomElements';

const setupElements = (initialState: ReturnType<typeof setupDomElements>) => {
  const chapterStart = initialState.doc.createElement('div');
  chapterStart.id = 'chapter-start';
  initialState.content.insertAdjacentElement('beforebegin', chapterStart);

  // Segundo placeholder para que el inicio del capítulo ocupe dos columnas en modo horizontal
  const chapterStartRight = initialState.doc.createElement('div');
  chapterStartRight.id = 'chapter-start-right';
  initialState.content.insertAdjacentElement('beforebegin', chapterStartRight);

  const chapterEnd = initialState.doc.createElement('div');
  chapterEnd.id = 'chapter-end';
  initialState.content.insertAdjacentElement('afterend', chapterEnd);

  const snapsContainer = initialState.doc.createElement('div');
  snapsContainer.id = 'snaps-container';
  initialState.wrapper.appendChild(snapsContainer);

  const snapsContainerRight = initialState.doc.createElement('div');
  snapsContainerRight.id = 'snaps-container-right';
  initialState.wrapper.appendChild(snapsContainerRight);

  return {
    chapterStart,
    chapterStartRight,
    chapterEnd,
    snapsContainer,
    snapsContainerRight,
  };
};

export default setupElements;
