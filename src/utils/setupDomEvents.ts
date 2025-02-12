import type { FullState } from '@/@types/state';
import { getConfig } from '@/utils/config';
import getSelection from '@/utils/getSelection';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const rightThreshold = 42.5;
const leftThreshold = 17.5;
const progressModes: FullState['progressMode'][] = ['percent', 'label', 'none'];

const setupDomEvents = () => {
  const state = getState();
  const config = getConfig();

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
    if (!isLongPress && !isMultipleTouch && !state.currentSelection) {
      checkIfScreenXBorderIsPressed(event);
    }
    if (touches.size === 0) {
      isMultipleTouch = false;
    }
    isLongPress = false;
  };

  const handleContextMenu = (event: Event) => {
    preventAndStopPropagation(event);
    isLongPress = true;
  };

  const handleSelectionChange = () => {
    const selection = getSelection();
    const text = selection.toString().trim();

    if (text) {
      const range = selection.getRangeAt(0);
      if (
        range &&
        !range.collapsed &&
        state.content.contains(range.startContainer) &&
        state.content.contains(range.endContainer)
      ) {
        updateState({
          currentSelection: { range, text },
        });
      }
    }
  };

  const handleProgressClick = (event: PointerEvent) => {
    preventAndStopPropagation(event);
    const progressIndex = progressModes.indexOf(state.progressMode);
    const progressMode =
      progressModes[(progressIndex + 1) % progressModes.length];
    if (progressMode) {
      updateState({
        progressMode,
      });
    }
  };

  window.addEventListener('contextmenu', handleContextMenu, true);
  document.addEventListener('contextmenu', handleContextMenu, true);
  window.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('contextmenu', handleContextMenu);

  state.win.addEventListener('contextmenu', handleContextMenu, true);
  state.doc.addEventListener('contextmenu', handleContextMenu, true);
  state.win.addEventListener('contextmenu', handleContextMenu);
  state.doc.addEventListener('contextmenu', handleContextMenu);

  state.progress.addEventListener('pointerdown', handleProgressClick);

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
