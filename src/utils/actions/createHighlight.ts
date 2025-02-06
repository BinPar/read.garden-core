import type { ActionHandler, CreateHighlight } from '@/@types/actions';
import clearSelection from '@/utils/clearSelection';
import { getConfig } from '@/utils/config';
import getScale from '@/utils/getScale';
import hideSelectionMenu from '@/utils/hideSelectionMenu';

const createHighlight: ActionHandler<CreateHighlight> = ({ action, state }) => {
  if (!state.selectionRanges?.length || !state.selectedText) {
    console.error('No selection ranges or selected text at createHighlight');
    return;
  }

  // TODO: Emit event with start and end info for highlight

  if (action.draw) {
    // TODO: Extract this to generic "drawHighlights" methods

    const rects = new Array<DOMRect>();
    for (let i = 0, l = state.selectionRanges.length; i < l; i++) {
      const range = state.selectionRanges[i];
      if (range) {
        const rangeRects = Array.from(range.getClientRects());
        rects.push(
          ...rangeRects.filter((rect) => rect.width > 0 && rect.height > 0),
        );
      }
    }

    // TODO: Deduplicate if fixed?? Is it really needed?

    if (rects.length) {
      const scale = getScale();

      if (state.layout === 'fixed') {
        const config = getConfig();
        const contentRect = state.content.getBoundingClientRect();

        for (let i = 0, l = rects.length; i < l; i++) {
          const rect = rects[i];
          if (rect) {
            const top =
              (rect.top - contentRect.top - config.padding.top) / scale;
            const left =
              (rect.left - contentRect.left - config.padding.left) / scale;
            const width = rect.width / scale;
            const height = rect.height / scale;

            const highlight = state.doc.createElement('div');
            highlight.setAttribute(
              'style',
              `--top: ${top}px; --left: ${left}px; --width: ${width}px; --height: ${height}px; --color: ${action.color}`,
            );
            highlight.dataset.key = action.key;

            state.highlights.appendChild(highlight);
          }
        }
      }

      if (state.layout === 'flow') {
        const startLeft = state.chapterStart.getBoundingClientRect().left;
        const wrapperTop = state.wrapper.getBoundingClientRect().top;

        for (let i = 0, l = rects.length; i < l; i++) {
          const rect = rects[i];
          if (rect) {
            const top = (rect.top - wrapperTop) / scale;
            const left = (rect.left - startLeft) / scale + state.columnGap / 2;
            const width = rect.width / scale;
            const height = rect.height / scale;

            const highlight = state.doc.createElement('div');
            highlight.setAttribute(
              'style',
              `--top: ${top}px; --left: ${left}px; --width: ${width}px; --height: ${height}px; --color: ${action.color}`,
            );
            highlight.dataset.key = action.key;

            state.highlights.appendChild(highlight);
          }
        }
      }
    }
  }

  if (action.clearSelection) {
    clearSelection();
  }

  if (action.hideMenu) {
    hideSelectionMenu();
  }
};

export default createHighlight;
