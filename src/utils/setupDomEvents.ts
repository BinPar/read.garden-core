import { getConfig } from '@/utils/config';
import getSelection from '@/utils/getSelection';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import showSelectionMenu from '@/utils/showSelectionMenu';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const rightThreshold = 20; // 45
const leftThreshold = 20;

const setupDomEvents = (state = getState(), config = getConfig()) => {
  const touches = new Set<number>();
  let isLongPress = false;
  let isSelection = false;
  let isMultipleTouch = false;

  const handleTouchStart = (event: PointerEvent) => {
    console.log('viewer touchstart');
    touches.add(event.pointerId);
    isMultipleTouch = touches.size > 1;
  };

  const checkIfScreenXBorderIsPressed = (event: PointerEvent) => {
    const touchX = event.x;
    if (touchX) {
      const width = state.doc.body.clientWidth;

      if (touchX <= width * (leftThreshold / 100)) {
        moveBackwards();
      } else if (touchX > width - width * (rightThreshold / 100)) {
        moveForward();
      } else if (config.touch) {
        switchMode();
      }
    }
  };

  const handleTouchEnd = (event: PointerEvent) => {
    touches.delete(event.pointerId);
    if (!isLongPress && !isMultipleTouch && !isSelection) {
      checkIfScreenXBorderIsPressed(event);
    }
    if (touches.size === 0) {
      isMultipleTouch = false;
    }
    isLongPress = false;
  };

  const handleContextMenu = (ev: MouseEvent) => {
    console.log('contextmenu');
    ev.preventDefault();
    isLongPress = true;
  };

  const handleSelectionChange = () => {
    const selection = getSelection();
    const text = selection.toString().trim();
    isLongPress = false;
    console.log('selectionchange');
    if (text) {
      isSelection = true;
      state.container.classList.add('selection-mode');
      const selectionRanges = new Array<Range>();
      for (let i = 0, l = selection.rangeCount; i < l; i++) {
        const range = selection.getRangeAt(i);
        if (range) {
          selectionRanges.push(range.cloneRange());
        }
      }
      showSelectionMenu();
      updateState({
        selectedText: text,
        selectionRanges,
      });
      return;
    }

    isSelection = false;
    updateState({
      selectedText: '',
      selectionRanges: null,
    });
  };

  state.win.addEventListener('contextmenu', handleContextMenu, true);
  state.doc.addEventListener('contextmenu', handleContextMenu, true);
  state.doc.addEventListener('selectionchange', handleSelectionChange);
  state.viewer.addEventListener('pointerdown', handleTouchStart);
  state.viewer.addEventListener('pointerup', handleTouchEnd);
  state.viewer.addEventListener('pointercancel', handleTouchEnd);
  state.selectionMenu.addEventListener('pointerup', preventAndStopPropagation);
  state.selectionMenu.addEventListener(
    'pointercancel',
    preventAndStopPropagation,
  );
};

export default setupDomEvents;
