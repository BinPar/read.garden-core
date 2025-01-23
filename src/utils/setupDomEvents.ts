import { getConfig } from '@/utils/config';
import getSelection from '@/utils/getSelection';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import showSelectionMenu from '@/utils/showSelectionMenu';
import { getState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const threshold = 33;

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
      // console.log({ w, pixels, touchX, touch: config.touch });

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
    // console.log('touchend');
    touches.delete(event.pointerId);
    const selection = getSelection();
    if (
      !isLongPress &&
      !isMultipleTouch &&
      (!selection || selection.isCollapsed)
    ) {
      checkIfScreenXBorderIsPressed(event);
    }
    if (touches.size === 0) {
      isMultipleTouch = false;
    }
    isLongPress = false;
  };

  const handleContextMenu = (ev: MouseEvent) => {
    // console.log('contextmenu');
    ev.preventDefault();
    isLongPress = true;
  };

  const handleSelectionChange = () => {
    // console.log('selectionchange');
    const selection = getSelection();
    const text = selection?.toString().trim();
    if (text) {
      showSelectionMenu();
    } else {
      hideSelectionMenu();
    }
  };

  state.doc.addEventListener('contextmenu', handleContextMenu, false);
  state.doc.addEventListener('selectionchange', handleSelectionChange);
  state.viewer.addEventListener('pointerdown', handleTouchStart);
  state.viewer.addEventListener('pointerup', handleTouchEnd);
  state.viewer.addEventListener('pointercancel', handleTouchEnd);
};

export default setupDomEvents;
