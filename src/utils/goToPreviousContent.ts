import genericCatch from '@/tools/genericCatch';
import loadContent from '@/utils/loadContent';
import { getState, updateState } from '@/utils/state';

const goToPreviousContent = () => {
  const state = getState();
  const content = state.orderedContents?.[state.contentOrder];
  if (content?.prev) {
    if (state.layout === 'flow') {
      updateState({ goToEnd: true }, true);
    }
    loadContent(content.prev).catch(
      genericCatch('Exception loading previous content (chapter/page)'),
    );
  }
};

export default goToPreviousContent;
