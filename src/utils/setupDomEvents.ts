import { getState } from '@/utils/state';

const longPressDuration = 500;

const setupDomEvents = (state = getState()) => {
  let timeout: NodeJS.Timeout;
  const touches = new Set<number>();

  const handleTouchStart = (event: PointerEvent) => {
    state.container.classList.add('touching');
    console.log('touch start');
    touches.add(event.pointerId);
    if (touches.size == 1) {
      timeout = setTimeout(handleLongPress, longPressDuration);
    }
    state.wrapper.setPointerCapture(event.pointerId);
  };

  const checkIfScreenXBorderIsPressed = (event: PointerEvent) => {
    const touchX = event.x;
    if (touchX) {
      const threshold = 20;
      const w = window.innerWidth;
      const pixels = w * (threshold / 100);

      if (touchX <= pixels) {
        console.log({ pixels, touchX });
        document.body.scrollLeft -= document.body.clientWidth;
      }

      if (touchX > w - pixels) {
        console.log({ touchX, content: w - pixels });
        document.body.scrollLeft += document.body.clientWidth;
      }
    }
  };

  const handleTouchEnd = (event: PointerEvent) => {
    console.log(event.type);
    touches.delete(event.pointerId);
    state.wrapper.releasePointerCapture(event.pointerId);
    state.container.classList.remove('touching');
    clearTimeout(timeout);
    checkIfScreenXBorderIsPressed(event);
    state.wrapper.dispatchEvent(new Event('scrollend'));
  };

  const handleTouchMove = (event: PointerEvent) => {
    if (state.wrapper.hasPointerCapture(event.pointerId)) {
      clearTimeout(timeout);
      state.wrapper.scrollLeft -= event.movementX;
    }
  };

  const handleLongPress = () => {
    if (touches.size != 1) {
      return null;
    }
    alert('Has hecho una pulsación larga');
  };

  state.wrapper.addEventListener('pointerdown', handleTouchStart);
  state.wrapper.addEventListener('pointermove', handleTouchMove);
  state.wrapper.addEventListener('pointerup', handleTouchEnd);
  state.wrapper.addEventListener('pointercancel', handleTouchEnd);
};

export default setupDomEvents;
