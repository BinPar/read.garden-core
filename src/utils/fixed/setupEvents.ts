import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

// TODO: Min and max from config
const minScale = 0.5;
const maxScale = 4;
let scale = 1;
let startScale = 0;
let lastScale = 0;
let startX = 0;
let startY = 0;
let originX = 0;
let originY = 0;

export const checkCenter = () => {
  const state = getState();
  const element = state.content;
  const parent = element.parentElement;

  if (!parent) {
    return;
  }

  window.requestAnimationFrame(() => {
    const parentRect = parent.getBoundingClientRect();
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

    let scrollLeft = startX;
    let scrollTop = startY;
    lastScale = scale / startScale;

    if (parentRect.width > elementWidth) {
      setCssVariable(
        'fixed-left',
        `${(parentRect.width - elementWidth) / 2}px`,
      );
    } else {
      setCssVariable('fixed-left', '0');
      scrollLeft = originX * lastScale - originX + startX;
    }

    if (parentRect.height > elementHeight) {
      setCssVariable(
        'fixed-top',
        `${(parentRect.height - elementHeight) / 2}px`,
      );
    } else {
      setCssVariable('fixed-top', '0');
      scrollTop = originY * lastScale - originY + startY;
    }

    console.log({
      scrollLeft,
      startX,
      originX,
      lastScale,
      startScale,
      scale,
    });

    state.wrapper.scrollTo({
      top: scrollTop,
      left: scrollLeft,
      behavior: 'instant',
    });
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

  const handleTouchStart = (e: TouchEvent) => {
    startX = state.wrapper.scrollLeft;
    startY = state.wrapper.scrollTop;
    if (e.touches.length === 2) {
      const [a, b] = Array.from(e.touches) as [Touch, Touch];
      startDistance = getDistance(a, b);
      startScale = scale;
      originX = Math.abs(a.clientX + b.clientX) / 2 + startX;
      originY = Math.abs(a.clientY + b.clientY) / 2 + startY;
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = Array.from(e.touches) as [Touch, Touch];
      const distance = getDistance(a, b);
      const zoomFactor = distance / startDistance;
      startDistance = distance;
      applyScale(zoomFactor);
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 0) {
      startDistance = 0;
      lastScale = scale / startScale;
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
