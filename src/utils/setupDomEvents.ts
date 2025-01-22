import { getConfig } from '@/utils/config';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import { getState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const threshold = 20;

const setupDomEvents = (state = getState(), config = getConfig()) => {
  const touches = new Set<number>();
  let isLongPress = false;
  let isMultipleTouch = false;

  const handleTouchStart = (event: PointerEvent) => {
    touches.add(event.pointerId);
    isMultipleTouch = touches.size > 1;
  };

  const checkIfScreenXBorderIsPressed = (event: PointerEvent) => {
    const touchX = event.x;
    if (touchX) {
      const w = state.doc.body.clientWidth;
      const pixels = w * (threshold / 100);

      console.log({
        pixels,
        touchX,
      });

      if (touchX <= pixels) {
        moveBackwards();
      } else if (touchX > w - pixels) {
        moveForward();
      } else if (config.touch) {
        switchMode();
      }
    }
  };

  const handleTouchEnd = (event: PointerEvent) => {
    touches.delete(event.pointerId);
    if (!isLongPress && !isMultipleTouch) {
      checkIfScreenXBorderIsPressed(event);
    }
    if (touches.size === 0) {
      isMultipleTouch = false;
    }
    isLongPress = false;
    state.wrapper.dispatchEvent(new Event('scrollend'));
  };

  const handleContextMenu = (ev: MouseEvent) => {
    ev.preventDefault();
    console.log('context menu');
    isLongPress = true;
  };

  // const handleSelectionChange = () => {
  //   console.log('selectionchange');
  // };

  state.doc.addEventListener('contextmenu', handleContextMenu, false);
  // state.doc.addEventListener('selectionchange', handleSelectionChange);
  state.viewer.addEventListener('pointerdown', handleTouchStart);
  state.viewer.addEventListener('pointerup', handleTouchEnd);
  state.viewer.addEventListener('pointercancel', handleTouchEnd);
};

export default setupDomEvents;
