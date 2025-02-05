import type { TextAlign } from '@/@types/common';
import { getState, updateState } from '@/utils/state';

const setTextAlign = (textAlign: TextAlign) => {
  const state = getState();

  if (state.layout !== 'flow') {
    return;
  }

  updateState({
    textAlign,
  });
};

export default setTextAlign;
