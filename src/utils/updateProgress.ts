import { getState } from '@/utils/state';

const updateProgress = () => {
  const state = getState();

  if (state.contentSlug) {
    if (state.progressMode === 'label') {
      const label =
        state.labelBySlug?.get(state.contentSlug) ?? state.contentSlug;
      state.progress.innerHTML = label;
    } else if (state.orderedContentSlugs?.length) {
      const index = state.orderedContentSlugs.indexOf(state.contentSlug);
      if (index >= 0) {
        const progress = parseFloat(
          Math.min(
            100,
            Math.max((index / state.orderedContentSlugs.length) * 100, 1),
          ).toFixed(1),
        );
        state.progress.innerHTML = `${progress}%`;
      }
    }
  }

  if (state.progressMode === 'none') {
    state.progress.classList.add('hidden');
  } else {
    state.progress.classList.remove('hidden');
  }
};

export default updateProgress;
