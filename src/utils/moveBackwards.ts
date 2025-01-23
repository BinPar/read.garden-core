import genericCatch from '@/tools/genericCatch';
import loadContent from '@/utils/loadContent';
import { getState, updateState } from '@/utils/state';

const moveBackwards = (state = getState()) => {
  if (state.layout === 'flow') {
    const left =
      state.wrapper.scrollLeft - (state.columnWidth + state.columnGap);
    if (left < state.firstSnap) {
      const content = state.orderedContents?.[state.contentOrder];
      if (content?.prev) {
        updateState({ goToEnd: true });
        loadContent(content.prev).catch(
          genericCatch('Exception loading previous chapter'),
        );
      }
    } else {
      state.wrapper.scrollTo({
        left,
        behavior: 'instant',
      });
    }
  }

  if (state.layout === 'fixed' && state.orderedContents) {
    const content = state.orderedContents[state.contentOrder];
    if (content?.prev) {
      loadContent(content.prev).catch(
        genericCatch('Exception loading next content'),
      );
    }
  }
};

export default moveBackwards;
