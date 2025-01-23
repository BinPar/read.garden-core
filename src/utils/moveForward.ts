import genericCatch from '@/tools/genericCatch';
import loadContent from '@/utils/loadContent';
import { getState } from '@/utils/state';

const moveForward = (state = getState()) => {
  if (state.layout === 'flow') {
    const left = state.wrapper.scrollLeft + state.columnWidth + state.columnGap;
    if (left > state.lastSnap) {
      const content = state.orderedContents?.[state.contentOrder];
      if (content?.next) {
        loadContent(content.next).catch(
          genericCatch('Exception loading next chapter'),
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
    if (content?.next) {
      loadContent(content.next).catch(
        genericCatch('Exception loading next content'),
      );
    }
  }
};

export default moveForward;
