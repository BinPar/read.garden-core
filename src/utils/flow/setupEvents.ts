import type { ContentRange } from '@/@types/state/flow';
import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import goToNextContent from '@/utils/goToNextContent';
import goToPreviousContent from '@/utils/goToPreviousContent';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import { getState, updateState } from '@/utils/state';
import waitForRender from '@/utils/waitForRender';

const scrollThreshold = 256;
const flowThreshold = 0.25;
const swipeThreshold = 210;

let leftThreshold = 0;
let rightThreshold = 0;
let wasNotSmooth = false;
let handledScrollEnd = false;
let isMultipleTouch = false;
let swipeStartX = 0;

const setupEvents = () => {
  const state = getState();
  const config = getConfig();

  if (state.layout !== 'flow') {
    return;
  }

  const pointers = new Set<number>();

  let scrollEndTimeout: NodeJS.Timeout | undefined = undefined;

  const chapterNavigation = (direction: 'prev' | 'next') => {
    setCssVariable('viewer-margin-top', '200svh');
    // setCssVariable('overflow-x', 'hidden');
    leftThreshold = 0;
    rightThreshold = 0;
    setCssVariable('flow-left-threshold', `${leftThreshold}`);
    setCssVariable('flow-right-threshold', `${rightThreshold}`);

    if (direction === 'prev') {
      waitForRender(goToPreviousContent, 1);
    }

    if (direction === 'next') {
      waitForRender(goToNextContent, 1);
    }

    wasNotSmooth = false;
  };

  const checkNavigation = () => {
    if (!pointers.size) {
      if (leftThreshold === 100) {
        chapterNavigation('prev');
      }
      if (rightThreshold === 100) {
        chapterNavigation('next');
      }
    }
  };

  const findContentSlugByScroll = (
    scrollLeft: number,
    ranges: ContentRange[],
  ): string | undefined => {
    return ranges.find((r) => scrollLeft >= r.from && scrollLeft <= r.to)?.slug;
  };

  const handleScrollEnd = () => {
    if (!pointers.size && !handledScrollEnd) {
      handledScrollEnd = true;
      checkNavigation();
      const contentSlug = findContentSlugByScroll(
        state.wrapper.scrollLeft,
        state.contentBySnapRange,
      );
      if (contentSlug) {
        updateState({
          contentSlug,
        });
      }
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

    if (leftThreshold === 100 || rightThreshold === 100) {
      wasNotSmooth = true;
      setCssVariable('scroll-behavior', 'auto');
      setCssVariable('scroll-snap-type', 'none');
    } else if (wasNotSmooth) {
      wasNotSmooth = false;
      setCssVariable('scroll-behavior', config.isEReader ? 'auto' : 'smooth');
      setCssVariable('scroll-snap-type', 'x mandatory');
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    isMultipleTouch = event.touches.length > 1;
    swipeStartX = event.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const swipeEndX = event.changedTouches[0]?.clientX ?? 0;
    const deltaX = swipeStartX - swipeEndX;
    if (
      Math.abs(deltaX) > swipeThreshold &&
      !isMultipleTouch &&
      config.isEReader
    ) {
      if (deltaX > 0) {
        // Swipe hacia la izquierda
        moveForward();
      } else {
        // Swipe hacia la derecha
        moveBackwards();
      }
    }
    if (event.touches.length === 0) {
      isMultipleTouch = false;
    }
    checkNavigation();
  };

  const handlePointerDown = (event: PointerEvent) => {
    pointers.add(event.pointerId);
    wasNotSmooth = false;
    handledScrollEnd = false;
  };

  const handlePointerUp = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
  };

  state.wrapper.addEventListener('scroll', handleScroll);
  state.viewer.addEventListener('touchend', handleTouchEnd);
  state.viewer.addEventListener('touchstart', handleTouchStart);

  state.viewer.addEventListener('pointerdown', handlePointerDown);
  state.viewer.addEventListener('pointerup', handlePointerUp);
  state.viewer.addEventListener('pointercancel', handlePointerUp);
};

export default setupEvents;
