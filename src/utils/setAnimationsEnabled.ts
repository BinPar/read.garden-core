import { getState, updateState } from '@/utils/state';

const setAnimationsEnabled = (animationsEnabled: boolean) => {
  const state = getState();
  updateState({ animationsEnabled });
  if (animationsEnabled) {
    state.container.classList.add('animated');
  } else {
    state.container.classList.remove('animated');
  }
  if (state.uiContainer) {
    state.uiContainer.style.transition = animationsEnabled
      ? 'top var(--animation-delay)'
      : 'none';
  }
};

export default setAnimationsEnabled;
