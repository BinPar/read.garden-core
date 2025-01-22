import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import { getState } from '@/utils/state';

const setupEvents = () => {
  const state = getState();
  const config = getConfig();

  if (state.layout !== 'fixed' || config.layout !== 'fixed') {
    return;
  }

  const element = state.content;
  const parent = element.parentElement;

  if (!parent) {
    return;
  }

  const minScale = 0.5;
  const maxScale = 4;
  let startDistance = 0;
  let scale = config.zoom / 100;

  const checkCenter = () => {
    window.requestAnimationFrame(() => {
      const parentRect = parent.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (parentRect.width > elementRect.width) {
        setCssVariable(
          'fixed-left',
          `${(parentRect.width - elementRect.width) / 2}px`,
        );
      } else {
        setCssVariable('fixed-left', '0');
      }

      if (parentRect.height > elementRect.height) {
        setCssVariable(
          'fixed-top',
          `${(parentRect.height - elementRect.height) / 2}px`,
        );
      } else {
        setCssVariable('fixed-top', '0');
      }
    });
  };

  const updateScale = () => {
    window.requestAnimationFrame(() => {
      setCssVariable('zoom', `${scale * 100}`);
      checkCenter();
    });
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

  const applyScale = (factor: number) => {
    if (factor === 1) {
      return;
    }
    scale *= factor;
    scale = Math.min(Math.max(scale, minScale), maxScale);
    updateScale();
  };

  updateScale();

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchmove', handleTouchMove);
  element.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('resize', checkCenter);
};

export default setupEvents;
