import { getState } from '@/utils/state';

const moveBackwards = (state = getState()) => {
  if (state.layout === 'flow') {
    const left =
      state.wrapper.scrollLeft - (state.columnWidth + state.columnGap);
    state.wrapper.scrollTo({
      left,
      behavior: 'instant',
    });
  }
};

export default moveBackwards;
