import type { ActionHandler, DrawHighlights } from '@/@types/actions';
import renderUserHighlight from '@/utils/renderUserHighlight';
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
      const existingDomHighlights = state.domHighlightsById.get(highlight.id);

      if (existingDomHighlights?.length) {
        for (let j = 0, k = existingDomHighlights.length; j < k; j++) {
          existingDomHighlights[j]?.remove();
        }
      }

      const highlights = renderUserHighlight(highlight);

      if (highlights) {
        state.domHighlightsById.set(highlight.id, highlights);
      }

      state.userHighlightsById.set(highlight.id, highlight);
    }
  }
};

export default drawHighlights;
