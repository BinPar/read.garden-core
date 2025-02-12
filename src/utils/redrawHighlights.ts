import renderUserHighlight from '@/utils/renderUserHighlight';
import { getState } from '@/utils/state';

const redrawHighlights = () => {
  const state = getState();

  console.log('redrawHighlights', state.userHighlightsById);

  if (state.userHighlightsById) {
    state.userHighlightsById.forEach((highlight) => {
      const highlights = renderUserHighlight(highlight);

      if (highlights) {
        state.domHighlightsById.set(highlight.id, highlights);
      }
    });
  }
};

export default redrawHighlights;
