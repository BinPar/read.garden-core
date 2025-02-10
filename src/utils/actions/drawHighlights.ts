import type { ActionHandler, DrawHighlights } from '@/@types/actions';
import getElementFromQuerySelector from '@/utils/getElementFromQuerySelector';
import { getHighlights } from '@/utils/renderHighlight';
import { updateState } from '@/utils/state';

const drawHighlights: ActionHandler<DrawHighlights> = ({ action, state }) => {
  if (state.loadingStyles || state.rendering) {
    updateState(
      (current) => ({
        pendingDrawActions: [...current.pendingDrawActions, action],
      }),
      true,
    );
    return;
  }

  for (let i = 0, l = action.highlights.length; i < l; i++) {
    const highlight = action.highlights[i];
    if (highlight) {
      const startContainer = getElementFromQuerySelector(
        highlight.range.start.querySelector,
      );
      if (!startContainer) {
        console.warn(
          `Could not find start container for ${highlight.range.start.querySelector}`,
        );
        continue;
      }

      const endContainer = getElementFromQuerySelector(
        highlight.range.end.querySelector,
      );
      if (!endContainer) {
        console.warn(
          `Could not find end container for ${highlight.range.end.querySelector}`,
        );
        continue;
      }

      const range = new Range();
      range.setStart(startContainer, highlight.range.start.offset);
      range.setEnd(endContainer, highlight.range.end.offset);
      const rects = range.getClientRects();
      console.log({ rects });

      if (!rects.length) {
        continue;
      }

      const highlights = getHighlights({
        rects: Array.from(rects),
        color: highlight.color,
        highlighter: highlight.highlighter,
        key: `${highlight.id}`,
        id: highlight.id,
        type: highlight.type,
      });

      for (let j = 0, m = highlights.length; j < m; j++) {
        const highlightElement = highlights[j];
        if (highlightElement) {
          state.highlights.appendChild(highlightElement);
        }
      }

      state.highlightsById.set(highlight.id, highlights);
    }
  }
};

export default drawHighlights;
