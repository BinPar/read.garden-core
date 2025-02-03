import goToNextContent from '@/utils/goToNextContent';
import { getState, updateState } from '@/utils/state';

const moveForward = (state = getState()) => {
  if (state.layout === 'flow') {
    updateState(
      {
        previousContent: null,
      },
      true,
    );
    const left = state.wrapper.scrollLeft + state.columnWidth + state.columnGap;
    if (left > state.lastSnap) {
      goToNextContent();
    } else {
      state.wrapper.scrollTo({
        left,
        behavior: 'instant',
      });
    }
  }

  if (state.layout === 'fixed') {
    goToNextContent();
  }
};

export default moveForward;
