import loadContent from '@/utils/loadContent';
import { getState } from '@/utils/state';

const goToNextContent = () => {
  const state = getState();
  const content = state.orderedContents?.[state.contentOrder];
  if (!content?.next) {
    return;
  }

  // En layout fijo, cuando está en doble página, saltar dos contenidos
  if (
    state.layout === 'fixed' &&
    state.pageLayout === 'double' &&
    content.next.next
  ) {
    loadContent(content.next.next);
    return;
  }

  // En flow, avanzar siempre un contenido
  loadContent(content.next);
};

export default goToNextContent;
