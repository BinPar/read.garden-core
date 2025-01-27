import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

// TODO: Min and max from config
const minScale = 0.5;
const maxScale = 4;
let scale = 1;

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

    if (parentRect.width > elementWidth) {
      setCssVariable(
        'fixed-left',
        `${(parentRect.width - elementWidth) / 2}px`,
      );
    } else {
      setCssVariable('fixed-left', '0');
    }

    if (parentRect.height > elementHeight) {
      setCssVariable(
        'fixed-top',
        `${(parentRect.height - elementHeight) / 2}px`,
      );
    } else {
      setCssVariable('fixed-top', '0');
    }
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
    if (e.touches.length === 2) {
      const [a, b] = Array.from(e.touches) as [Touch, Touch];
      startDistance = calculateDistance(a, b);
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = Array.from(e.touches) as [Touch, Touch];
      const distance = calculateDistance(a, b);
      const scale = distance / startDistance;

      applyScale(scale);

      startDistance = distance;
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    startDistance = 0;
  };

  const calculateDistance = (p1: Touch, p2: Touch): number => {
    return Math.sqrt(
      Math.pow(p2.clientX - p1.clientX, 2) +
        Math.pow(p2.clientY - p1.clientY, 2),
    );
  };

  updateScale();

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchmove', handleTouchMove);
  element.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('resize', checkCenter);
};

export default setupEvents;
