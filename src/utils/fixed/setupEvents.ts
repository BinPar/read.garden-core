import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

interface Point {
  clientX: number;
  clientY: number;
}

interface Pointer extends Point {
  id: number;
}

// TODO: Min and max from config
const minScale = 0.5;
const maxScale = 4;
let scale = 1;

export const checkCenter = (panPoint?: Point) => {
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

      if (panPoint) {
        const percent = panPoint.clientX / state.wrapper.clientWidth;

        console.log({
          clientX: panPoint.clientX,
          width: parentRect.width,
          percent,
        });
      }
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

const updateScale = (panPoint?: Point) => {
  window.requestAnimationFrame(() => {
    setCssVariable('zoom', `${scale * 100}`);
    updateState({ zoom: scale * 100 }, true);
    checkCenter(panPoint);
  });
};

export const setScale = (newValue: number, panPoint?: Point) => {
  const newScale = Math.min(Math.max(newValue, minScale), maxScale);
  if (newScale === scale) {
    return;
  }
  scale = newValue;
  updateScale(panPoint);
};

const getDistance = (p1: Touch, p2: Touch): number =>
  Math.sqrt(
    Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2),
  );

const getMidpoint = (a: Point, b?: Point) => {
  if (!b) {
    return a;
  }

  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  } satisfies Point;
};

const setupEvents = () => {
  const state = getState();
  const config = getConfig();

  if (state.layout !== 'fixed' || config.layout !== 'fixed') {
    return;
  }

  scale = config.zoom / 100;
  const element = state.content;

  const currentPointers = new Array<Pointer>();

  let startDistance = 0;

  const applyScale = (factor: number, panPoint: Point) => {
    if (factor === 1) {
      return;
    }
    setScale(scale * factor, panPoint);
  };

  const handleTouchStart = (e: TouchEvent) => {
    for (const touch of Array.from(e.changedTouches)) {
      currentPointers.push({
        id: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    }

    if (e.touches.length === 2) {
      const [a, b] = Array.from(e.touches) as [Touch, Touch];
      startDistance = getDistance(a, b);
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = Array.from(e.touches) as [Touch, Touch];
      const distance = getDistance(a, b);
      const scale = distance / startDistance;

      let midpoint: Point = {
        clientX: 0,
        clientY: 0,
      };

      const changedPointers = Array.from(e.changedTouches).map<Pointer>(
        (touch) => ({
          id: touch.identifier,
          clientX: touch.clientX,
          clientY: touch.clientY,
        }),
      );
      const trackedChangedPointers = [];

      for (const pointer of changedPointers) {
        const index = currentPointers.findIndex((p) => p.id === pointer.id);
        if (index !== -1) {
          trackedChangedPointers.push(pointer);
          currentPointers[index] = pointer;
        }
      }

      const [firstTracked, ...tracked] = trackedChangedPointers;

      if (firstTracked) {
        midpoint = getMidpoint(firstTracked, tracked[1]);
      }

      applyScale(scale, midpoint);

      startDistance = distance;
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    startDistance = 0;

    for (const touch of Array.from(e.changedTouches)) {
      const index = currentPointers.findIndex((p) => p.id === touch.identifier);
      if (index !== -1) {
        currentPointers.splice(index, 1);
      }
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
