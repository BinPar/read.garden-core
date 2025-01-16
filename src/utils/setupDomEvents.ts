import { getState } from '@/utils/state';

const longPressDuration = 500;

const setupDomEvents = (state = getState()) => {
  let timeout: NodeJS.Timeout;
  const touches = new Set<number>();

  const handleLongPress = () => {
    if (touches.size != 1) {
      return null;
    }
    alert('Has hecho una pulsación larga');
  };

  const handleTouchStart = (event: PointerEvent) => {
    console.log(event.type);
    if (touches.size === 0) {
      timeout = setTimeout(handleLongPress, longPressDuration);
    }
    touches.add(event.pointerId);
  };

  const checkIfScreenXBorderIsPressed = (event: PointerEvent) => {
    const touchX = event.x;
    if (touchX) {
      const threshold = 20;
      const w = window.innerWidth;
      const pixels = w * (threshold / 100);

      if (touchX <= pixels) {
        console.log({ pixels, touchX });
        if (state.layout === 'flow') {
          state.wrapper.scrollLeft -= state.columnWidth + state.columnGap;
        }
      }

      if (touchX > w - pixels) {
        console.log({ touchX, content: w - pixels });
        if (state.layout === 'flow') {
          state.wrapper.scrollLeft += state.columnWidth + state.columnGap;
        }
      }
    }
  };

  const handleTouchEnd = (event: PointerEvent) => {
    console.log(event.type);
    touches.delete(event.pointerId);
    clearTimeout(timeout);
    checkIfScreenXBorderIsPressed(event);
    state.wrapper.dispatchEvent(new Event('scrollend'));
  };

  // const handleTouchMove = (event: PointerEvent) => {
  //   if (state.wrapper.hasPointerCapture(event.pointerId)) {
  //     clearTimeout(timeout);
  //     state.wrapper.scrollLeft -= event.movementX;
  //   }
  // };

  const handleScroll = () => {
    clearTimeout(timeout);
  };

  state.wrapper.addEventListener('pointerdown', handleTouchStart);
  // state.wrapper.addEventListener('pointermove', handleTouchMove);
  state.wrapper.addEventListener('pointerup', handleTouchEnd);
  state.wrapper.addEventListener('pointercancel', handleTouchEnd);
  state.wrapper.addEventListener('scroll', handleScroll);
};

export default setupDomEvents;
