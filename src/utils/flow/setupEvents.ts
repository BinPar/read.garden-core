import setCssVariable from '@/tools/setCssVariable';
import goToNextContent from '@/utils/goToNextContent';
import goToPreviousContent from '@/utils/goToPreviousContent';
import { getState, updateState } from '@/utils/state';
import waitForRender from '@/utils/waitForRender';

const scrollThreshold = 128;
const flowThreshold = 0.25;

let leftThreshold = 0;
let rightThreshold = 0;
let handledScrollEnd = false;

const setupEvents = () => {
  const state = getState();

  if (state.layout !== 'flow') {
    return;
  }

  const pointers = new Set<number>();

  let scrollEndTimeout: NodeJS.Timeout | undefined = undefined;

  const handleScrollEnd = () => {
    if (!pointers.size && !handledScrollEnd) {
      console.log('scrollend');
      const contentSlug = state.contentBySnap.get(state.wrapper.scrollLeft);
      if (contentSlug) {
        updateState({
          contentSlug,
        });
      }
      handledScrollEnd = true;
    }
  };

  const handleScroll = () => {
    window.clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(() => {
      window.requestAnimationFrame(handleScrollEnd);
    }, scrollThreshold);

    if (state.wrapper.scrollLeft < state.firstSnap) {
      leftThreshold = Math.min(
        ((state.firstSnap - state.wrapper.scrollLeft) /
          (state.columnGap + state.columnWidth) /
          flowThreshold) *
          100,
        100,
      );
    } else {
      leftThreshold = 0;
    }

    if (state.wrapper.scrollLeft > state.lastSnap) {
      rightThreshold = Math.min(
        ((state.wrapper.scrollLeft - state.lastSnap) /
          (state.columnGap + state.columnWidth) /
          flowThreshold) *
          100,
        100,
      );
    } else {
      rightThreshold = 0;
    }

    setCssVariable('flow-left-threshold', `${leftThreshold}`);
    setCssVariable('flow-right-threshold', `${rightThreshold}`);

    if (leftThreshold >= 100 || rightThreshold >= 100) {
      setCssVariable('scroll-behavior', 'auto');
      setCssVariable('scroll-snap-type', 'none');
    } else {
      setCssVariable('scroll-behavior', 'smooth');
      setCssVariable('scroll-snap-type', 'x mandatory');
    }
  };

  const chapterNavigation = (direction: 'prev' | 'next') => {
    leftThreshold = 0;
    rightThreshold = 0;
    setCssVariable('viewer-margin-top', '200svh');
    setCssVariable('flow-left-threshold', `${leftThreshold}`);
    setCssVariable('flow-right-threshold', `${rightThreshold}`);

    waitForRender(() => {
      if (direction === 'prev') {
        state.wrapper.scrollTo({
          left: state.firstSnap,
          behavior: 'instant',
        });
        waitForRender(goToPreviousContent);
      }

      if (direction === 'next') {
        state.wrapper.scrollTo({
          left: state.lastSnap,
          behavior: 'instant',
        });
        waitForRender(goToNextContent);
      }
    });
  };

  const handleTouchEnd = (event: TouchEvent) => {
    for (let i = 0, l = event.changedTouches.length; i < l; i++) {
      const touch = event.changedTouches[i];
      if (touch) {
        pointers.delete(touch.identifier);
      }
    }
    if (!pointers.size) {
      if (leftThreshold >= 100) {
        chapterNavigation('prev');
      }
      if (rightThreshold >= 100) {
        chapterNavigation('next');
      }
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    for (let i = 0, l = event.changedTouches.length; i < l; i++) {
      const touch = event.changedTouches[i];
      if (touch) {
        pointers.add(touch.identifier);
      }
    }
    handledScrollEnd = false;
  };

  state.wrapper.addEventListener('scroll', handleScroll);
  state.viewer.addEventListener('touchend', handleTouchEnd);
  state.viewer.addEventListener('touchstart', handleTouchStart);
};

export default setupEvents;
