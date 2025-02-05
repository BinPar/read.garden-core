import goToPreviousContent from '@/utils/goToPreviousContent';
import { getState, updateState } from '@/utils/state';

const moveBackwards = () => {
  const state = getState();
  
  if (state.layout === 'flow') {
    updateState(
      {
        previousContent: null,
      },
      true,
    );
    const left =
      state.wrapper.scrollLeft - (state.columnWidth + state.columnGap);
    if (left < state.firstSnap) {
      goToPreviousContent();
    } else {
      state.wrapper.scrollTo({
        left,
        behavior: 'instant',
      });
    }
  }

  if (state.layout === 'fixed') {
    goToPreviousContent();
  }
};

export default moveBackwards;
