import type { FullState } from '@/@types/state';
import debounce from '@/tools/debounce';
import clearSelection from '@/utils/clearSelection';
import { getConfig } from '@/utils/config';
import setFitMode from '@/utils/fixed/setFitMode';
import getSelection from '@/utils/getSelection';
import hideMenuNote from '@/utils/hideNoteMenu';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import loadContent from '@/utils/loadContent';
import moveBackwards from '@/utils/moveBackwards';
import moveForward from '@/utils/moveForward';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import redrawHighlights from '@/utils/redrawHighlights';
import waitForRender from '@/utils/waitForRender';
import isWebKit from '@/tools/isWebKit';
import { checkCenter } from '@/utils/fixed/setupEvents';
import { getState, updateState } from '@/utils/state';
import switchMode from '@/utils/switchMode';

const rightThreshold = 38.5;
const rightThresholdLandscape = 30.5;
const leftThreshold = 17.5;
const progressModes: FullState['progressMode'][] = ['percent', 'label', 'none'];
let scrollPositionAfterResize = 0;
let scrollPositionAfterSelect = 0;

const setupDomEvents = () => {
  const state = getState();
  const config = getConfig();

  const touches = new Set<number>();
  let isMultipleTouch = false;
  let hasSelection = false;

  const handleTouchStart = (event: PointerEvent) => {
    touches.add(event.pointerId);
    isMultipleTouch = touches.size > 1;

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
    scrollPositionAfterResize = state.wrapper.scrollLeft;
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

      if (state.layout === 'flow') {
        setTimeout(() => {
          state.wrapper.scrollTo({
            left: scrollPositionAfterResize,
            behavior: 'instant',
          });
        }, 100);
      }
      if (state.layout === 'fixed') {
        const currentContent = state.contentsBySlug?.get(state.contentSlug);
        if (currentContent) {
          loadContent(currentContent);
        }
        setTimeout(() => {
          const newFitMode = isLandscape ? 'height' : 'width';
          setFitMode(newFitMode);
          // Esperar al siguiente frame y un breve timeout para que
          // se apliquen zoom y centrado antes de recalcular highlights
          waitForRender(
            () => {
              checkCenter();
              redrawHighlights();
            },
            isWebKit() ? 128 : 1,
          );
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
