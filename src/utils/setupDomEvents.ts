import type { FullState } from '@/@types/state';
import debounce from '@/tools/debounce';
import clearSelection from '@/utils/clearSelection';
import { getConfig } from '@/utils/config';
import getSelection from '@/utils/getSelection';
import hideMenuNote from '@/utils/hideNoteMenu';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import loadContent from '@/utils/loadContent';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import redrawHighlights from '@/utils/redrawHighlights';
import waitForRender from '@/utils/waitForRender';
import { checkCenter } from '@/utils/fixed/setupEvents';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';
import { fixedSetup } from '@/utils/fixed/setup';

const rightThreshold = 38.5;
const rightThresholdLandscape = 30.5;
const leftThreshold = 17.5;
const progressModes: FullState['progressMode'][] = ['percent', 'label', 'none'];
let scrollPositionAfterSelect = 0;
const SWIPE_DELTA_X_THRESHOLD = 80; // movimiento horizontal del puntero (px)
const PAN_DELTA_THRESHOLD = 5; // cambio de scroll (px)

const setupDomEvents = () => {
  const state = getState();
  const config = getConfig();

  const touches = new Set<number>();
  let isMultipleTouch = false;
  let hasSelection = false;
  let pointerStartX = 0;
  let pointerStartScrollLeft = 0;
  let pointerStartScrollTop = 0;

  const handleTouchStart = (event: PointerEvent) => {
    touches.add(event.pointerId);
    isMultipleTouch = touches.size > 1;

    // Capturar estado inicial para detectar swipe/pan en pointerup
    pointerStartX = event.clientX;
    pointerStartScrollLeft = state.wrapper.scrollLeft;
    pointerStartScrollTop = state.wrapper.scrollTop;

    if (state.currentSelection || state.currentHighlight) {
      if (state.currentHighlight) {
        state.currentHighlight.domHighlights.forEach((domHighlight) => {
          domHighlight.remove();
        });
        hideMenuNote();
      }
    }
  };

  const checkIfScreenXBorderIsPressed = (event: PointerEvent) => {
    // Si parece un swipe/pan táctil, no ejecutar navegación por bordes
    const isTouchPointer = event.pointerType !== 'mouse';
    const deltaX = Math.abs(event.clientX - pointerStartX);
    const scrollDeltaX = Math.abs(
      state.wrapper.scrollLeft - pointerStartScrollLeft,
    );
    const scrollDeltaY = Math.abs(
      state.wrapper.scrollTop - pointerStartScrollTop,
    );
    const isSwipeOrPan =
      isTouchPointer &&
      (deltaX > SWIPE_DELTA_X_THRESHOLD ||
        scrollDeltaX > PAN_DELTA_THRESHOLD ||
        scrollDeltaY > PAN_DELTA_THRESHOLD);
    if (isSwipeOrPan) {
      return;
    }

    const touchX = event.x;
    if (touchX) {
      const width = state.doc.body.clientWidth;
      const isLandscapeOrientation =
        screen.orientation?.type.includes('landscape');
      const newRightThreshold = isLandscapeOrientation
        ? rightThresholdLandscape
        : rightThreshold;

      if (touchX <= width * (leftThreshold / 100)) {
        moveBackwards();
      } else if (touchX > width - width * (newRightThreshold / 100)) {
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
      !hasSelection &&
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
    if (hasSelection && !state.currentSelection) {
      hasSelection = false;
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
        ((state.content.contains(range.startContainer) &&
          state.content.contains(range.endContainer)) ||
          (state.contentRight?.contains(range.startContainer) &&
            state.contentRight?.contains(range.endContainer)))
      ) {
        updateState({
          currentSelection: { range, text },
        });
        if (!hasSelection) {
          scrollPositionAfterSelect = state.wrapper.scrollLeft;
        }
        hasSelection = true;
      }
    } else if (state.currentSelection) {
      clearSelection();
      hideSelectionMenu();
      debounceScroll();
    }
  };

  const debounceScroll = debounce(() => {
    if (!state.currentSelection && state.layout === 'flow') {
      state.wrapper.scrollTo({
        left: scrollPositionAfterSelect,
        behavior: 'instant',
      });
    }
  }, 300);

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

  const handleOrientationChange = () => {
    setTimeout(() => {
      const containerRect = state.container.getBoundingClientRect();
      const containerWidth = Math.floor(containerRect.width);
      const containerHeight = Math.floor(containerRect.height);

      updateState({
        containerWidth,
        containerHeight,
      });

      // Detect mobile landscape orientation
      const isLandscape = screen.orientation?.type?.includes('landscape');
      const pageLayout = isLandscape ? 'double' : 'single';
      updateState({ pageLayout });
      state.container.classList.remove('single');
      state.container.classList.remove('double');
      state.container.classList.add(pageLayout);

      if (state.layout === 'fixed') {
        const currentContent = state.contentsBySlug?.get(state.contentSlug);
        if (currentContent) {
          loadContent(currentContent);
        }
        setTimeout(() => {
          const newFitMode = isLandscape ? 'height' : 'width';
          updateState({ fitMode: newFitMode });
          fixedSetup();
          waitForRender(() => {
            checkCenter();
            redrawHighlights();
          }, 100);
        }, 100);
      }
    }, 150);
  };

  window.addEventListener('contextmenu', handleContextMenu, true);
  document.addEventListener('contextmenu', handleContextMenu, true);
  window.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('contextmenu', handleContextMenu);
  window.screen.orientation.addEventListener('change', handleOrientationChange);

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
