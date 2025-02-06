import type { LineHeight } from '@/@types/common';
import { getState, updateState } from '@/utils/state';

const setLineHeight = (lineHeight: LineHeight) => {
  const state = getState();

  if (state.layout !== 'flow') {
    return;
  }

  updateState({
    lineHeight,
  });
};

export default setLineHeight;
