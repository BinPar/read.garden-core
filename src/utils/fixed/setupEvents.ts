import debounce from '@/tools/debounce';
import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import { getState, updateState } from '@/utils/state';

// TODO: Min and max from config
const minScale = 0.2;
const maxScale = 4;
const swipeThreshold = 210;

let isMultipleTouch = false;
let scale = 1;
let verticalStartScale = 0;
let horizontalStartScale = 0;
let swipeStartX = 0;
let startX = 0;
let startY = 0;
let originX = 0;
let originY = 0;
let panStartScrollLeft = 0;
let panStartScrollTop = 0;

let previousFixedLeft = 0;
let previousFixedTop = 0;

const getFixedContentTransform = () => {
  const state = getState();
  const parent = state.content.parentElement;

  if (parent?.id === 'fixed-content-transform') {
    return parent;
  }

  return state.content;
};

const updateFixedLayoutSize = () => {
  const element = getFixedContentTransform();
  const layoutWidth = element.scrollWidth || element.clientWidth;
  const layoutHeight = element.scrollHeight || element.clientHeight;
  const width = layoutWidth * scale;
  const height = layoutHeight * scale;

  setCssVariable('fixed-layout-width', `${width}px`);
  setCssVariable('fixed-layout-height', `${height}px`);

  return { width, height };
};

export const checkCenter = () => {
  const state = getState();
  const parent = state.wrapper;
  if (!parent) {
    return;
  }

  window.requestAnimationFrame(() => {
    const parentRect = parent.getBoundingClientRect();
    const parentWidth = parentRect.width;
    const parentHeight = parentRect.height;

    const { width: elementWidth, height: elementHeight } =
      updateFixedLayoutSize();

    if (elementHeight === 0 || elementWidth === 0) {
      return;
    }

    let fixedLeft = 0;
    let fixedTop = 0;
    let scrollLeft = 0;
    let scrollTop = 0;

    if (parentWidth > elementWidth) {
      fixedLeft = (parentWidth - elementWidth) / 2;
    } else {
      if (previousFixedLeft) {
        horizontalStartScale = scale;
      }
      scrollLeft = originX * (scale / horizontalStartScale) - originX + startX;
    }

    if (parentHeight > elementHeight) {
      fixedTop = (parentHeight - elementHeight) / 2;
    } else {
      if (previousFixedTop) {
        verticalStartScale = scale;
      }
      scrollTop = originY * (scale / verticalStartScale) - originY + startY;
    }

    if (fixedLeft !== previousFixedLeft) {
      setCssVariable('fixed-left', `${fixedLeft}px`);
    }

    if (fixedTop !== previousFixedTop) {
      setCssVariable('fixed-top', `${fixedTop}px`);
    }

    if (scrollLeft || scrollTop) {
      state.wrapper.scrollTo({
        top: scrollTop,
        left: scrollLeft,
        behavior: 'instant',
      });
    }

    previousFixedLeft = fixedLeft;
    previousFixedTop = fixedTop;
  });
};

const updateScale = () => {
  window.requestAnimationFrame(() => {
    setCssVariable('zoom', `${scale * 100}`);
    updateState({ zoom: scale * 100 }, true);
    checkCenter();
  });
};

export const setScale = (newValue: number) => {
  const newScale = Math.min(Math.max(newValue, minScale), maxScale);
  if (newScale === scale) {
    updateScale();
    return;
  }
  scale = newScale;
  updateScale();
};

const getDistance = (p1: Touch, p2: Touch): number =>
  Math.sqrt(
    Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2),
  );

const setupEvents = () => {
  const state = getState();
  const config = getConfig();

  if (state.layout !== 'fixed' || config.layout !== 'fixed') {
    return;
  }

  scale = config.zoom / 100;
  const element = getFixedContentTransform();

  let startDistance = 0;

  const applyScale = (factor: number) => {
    if (factor === 1) {
      return;
    }
    setScale(scale * factor);
  };

  const handleTouchStart = (event: TouchEvent) => {
    isMultipleTouch = event.touches.length > 1;
    updateState({ fitMode: 'none' });
    swipeStartX = event.touches[0]?.clientX ?? 0;
    // Registrar posición de scroll para detectar pan vs swipe
    panStartScrollLeft = state.wrapper.scrollLeft;
    panStartScrollTop = state.wrapper.scrollTop;
    if (event.touches.length === 2) {
      startX = state.wrapper.scrollLeft;
      startY = state.wrapper.scrollTop;
      const [a, b] = Array.from(event.touches) as [Touch, Touch];
      startDistance = getDistance(a, b);
      verticalStartScale = scale;
      horizontalStartScale = scale;
      originX = Math.abs(a.clientX + b.clientX) / 2 + startX;
      originY = Math.abs(a.clientY + b.clientY) / 2 + startY;
      event.preventDefault();
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      const [a, b] = Array.from(event.touches) as [Touch, Touch];
      const distance = getDistance(a, b);
      const zoomFactor = distance / startDistance;
      startDistance = distance;
      applyScale(zoomFactor);
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const swipeEndX = event.changedTouches[0]?.clientX ?? 0;
    const deltaX = swipeStartX - swipeEndX;
    const effectiveThreshold = swipeThreshold * Math.max(1, scale);
    const panDeltaX = Math.abs(state.wrapper.scrollLeft - panStartScrollLeft);
    const panDeltaY = Math.abs(state.wrapper.scrollTop - panStartScrollTop);
    const panThreshold = 5 * Math.max(1, scale);

    if (
      panDeltaX > panThreshold ||
      panDeltaY > panThreshold ||
      isMultipleTouch
    ) {
      if (event.touches.length === 0) {
        startDistance = 0;
        debounce(() => {
          isMultipleTouch = false;
        }, 500);
      }
      return;
    }
    if (Math.abs(deltaX) > effectiveThreshold && !isMultipleTouch) {
      if (deltaX > 0) {
        // Swipe hacia la izquierda
        moveForward();
      } else {
        // Swipe hacia la derecha
        moveBackwards();
      }
    }
    if (event.touches.length === 0) {
      startDistance = 0;
      debounce(() => {
        isMultipleTouch = false;
      }, 500);
    }
  };

  const handleResize = () => {
    checkCenter();
  };

  updateScale();

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchmove', handleTouchMove);
  element.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('resize', handleResize);
};

export default setupEvents;
