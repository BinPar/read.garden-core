import { getState } from '@/utils/state';

const switchMode = (state = getState()) => {
  state.container.classList.toggle('ui-mode');
};

export default switchMode;
