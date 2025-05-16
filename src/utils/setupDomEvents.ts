import type { FullState } from '@/@types/state';
import clearSelection from '@/utils/clearSelection';
import { getConfig } from '@/utils/config';
import getSelection from '@/utils/getSelection';
import hideMenuNote from '@/utils/hideNoteMenu';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const rightThreshold = 42.5;
const leftThreshold = 17.5;
const progressModes: FullState['progressMode'][] = ['percent', 'label', 'none'];
function isMobileDevice(): boolean {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

const setupDomEvents = () => {
  const state = getState();
  const config = getConfig();

  const touches = new Set<number>();
  let isMultipleTouch = false;

  const handleTouchStart = (event: PointerEvent) => {
    touches.add(event.pointerId);
    isMultipleTouch = touches.size > 1;

    if (state.currentSelection || state.currentHighlight) {
      if (!isMobileDevice()) {
        clearSelection();
      }
      if (state.currentHighlight) {
        state.currentHighlight.domHighlights.forEach((domHighlight) => {
          domHighlight.remove();
        });
        hideMenuNote();
      }
    }
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

    if (
      !isMultipleTouch &&
      !state.currentSelection &&
      !state.clickedHighlight &&
      !state.clickedNoteHighlight
    ) {
      checkIfScreenXBorderIsPressed(event);
    }

    if (state.clickedHighlight) {
      updateState({ clickedHighlight: null });
    }

    if (state.clickedNoteHighlight) {
      updateState({ clickedNoteHighlight: null });
    }

    if (touches.size === 0) {
      isMultipleTouch = false;
    }
  };

  const handleContextMenu = (event: Event) => {
    preventAndStopPropagation(event);
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
    } else {
      if (isMobileDevice()) {
        // en desktop el evento selection change se ejecuta muchas veces
        // en mobile solo una vez y es al final de la selección
        clearSelection();
        hideSelectionMenu();
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
  state.wrapper.addEventListener('pointerdown', handleTouchStart);
  state.wrapper.addEventListener('pointerup', handleTouchEnd);
  state.wrapper.addEventListener('pointercancel', handleTouchEnd);
  state.selectionMenu.addEventListener('pointerup', preventAndStopPropagation);
  state.selectionMenu.addEventListener(
    'pointercancel',
    preventAndStopPropagation,
  );
};

export default setupDomEvents;
