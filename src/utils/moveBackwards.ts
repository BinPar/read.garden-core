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
    const totalColumnWidth = state.columnWidth + state.columnGap;
    const stride =
      state.pageLayout === 'double' && state.columnCount >= 2
        ? totalColumnWidth * 2
        : totalColumnWidth;
    const left = state.wrapper.scrollLeft - stride;
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
