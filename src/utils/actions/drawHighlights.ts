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
      const highlights = renderUserHighlight(highlight);

      if (highlights) {
        state.domHighlightsById.set(highlight.id, highlights);
      }

      state.userHighlightsById.set(highlight.id, highlight);
    }
  }
};

export default drawHighlights;
