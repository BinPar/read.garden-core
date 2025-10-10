import loadContent from '@/utils/loadContent';
import { getState, updateState } from '@/utils/state';

const goToPreviousContent = () => {
  const state = getState();
  const content = state.orderedContents?.[state.contentOrder];
  if (content?.prev) {
    if (state.layout === 'flow') {
      updateState({ goToEnd: true }, true);
    }
    if (state.pageLayout === 'double' && content?.prev?.prev) {
      loadContent(content?.prev?.prev);
    } else {
      loadContent(content.prev);
    }
  }
};

export default goToPreviousContent;
