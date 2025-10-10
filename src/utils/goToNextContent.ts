import loadContent from '@/utils/loadContent';
import { getState } from '@/utils/state';

const goToNextContent = () => {
  const state = getState();
  const content = state.orderedContents?.[state.contentOrder];
  if (state.pageLayout === 'double' && content?.next?.next) {
    loadContent(content?.next?.next);
  } else if (content?.next) {
    loadContent(content.next);
  }
};

export default goToNextContent;
