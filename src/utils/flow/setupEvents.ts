import { getState, updateState } from '@/utils/state';

const scrollThreshold = 128;

const setupEvents = () => {
  const state = getState();

  if (state.layout !== 'flow') {
    return;
  }

  let scrollEndTimeout: NodeJS.Timeout | undefined = undefined;

  const handleScrollEnd = () => {
    const contentSlug = state.contentBySnap.get(state.wrapper.scrollLeft);
    if (contentSlug) {
      updateState({
        contentSlug,
      });
    }
  };

  const handleScroll = () => {
    window.clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(() => {
      window.requestAnimationFrame(handleScrollEnd);
    }, scrollThreshold);
  };

  state.wrapper.addEventListener('scroll', handleScroll);
};

export default setupEvents;
