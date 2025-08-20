import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import { getState, updateState } from '@/utils/state';

// TODO: Min and max from config
const minScale = 0.5;
const maxScale = 4;
const swipeThreshold = 210;

let parentWidth = 0;
let parentHeight = 0;

let scale = 1;
let verticalStartScale = 0;
let horizontalStartScale = 0;
let swipeStartX = 0;
let startX = 0;
let startY = 0;
let originX = 0;
let originY = 0;

let previousFixedLeft = 0;
let previousFixedTop = 0;

export const checkCenter = () => {
  const state = getState();
  const element = state.content;
  const parent = element.parentElement;

  if (!parent) {
    return;
  }

  window.requestAnimationFrame(() => {
    if (!parentWidth || !parentHeight) {
      const parentRect = parent.getBoundingClientRect();
      parentWidth = parentRect.width;
      parentHeight = parentRect.height;
    }

    const elementRect = element.getBoundingClientRect();

    let elementWidth = elementRect.width;
    let elementHeight = elementRect.height;

    if (elementHeight === 0 || elementWidth === 0) {
      return;
    }

    if (state.isSafari) {
      elementWidth = elementWidth * scale;
      elementHeight = elementHeight * scale;
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
    return;
  }
  scale = newValue;
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
  const element = state.content;

  let startDistance = 0;

  const applyScale = (factor: number) => {
    if (factor === 1) {
      return;
    }
    setScale(scale * factor);
  };

  const handleTouchStart = (event: TouchEvent) => {
    updateState({ fitMode: 'none' });
    swipeStartX = event.touches[0]?.clientX ?? 0;
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
    if (Math.abs(deltaX) > swipeThreshold) {
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
