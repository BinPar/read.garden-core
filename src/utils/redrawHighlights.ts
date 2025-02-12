import renderUserHighlight from '@/utils/renderUserHighlight';
import { getState } from '@/utils/state';

const redrawHighlights = () => {
  const state = getState();

  console.log('redrawHighlights', state.userHighlightsById);

  if (state.userHighlightsById) {
    state.highlights.remove();
    state.highlights.innerHTML = '';
    if (state.layout === 'fixed') {
      state.content.appendChild(state.highlights);
    }
    if (state.layout === 'flow') {
      state.wrapper.appendChild(state.highlights);
    }

    state.userHighlightsById.forEach((highlight) => {
      const highlights = renderUserHighlight(highlight);

      if (highlights) {
        state.domHighlightsById.set(highlight.id, highlights);
      }
    });
  }
};

export default redrawHighlights;
