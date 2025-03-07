import renderUserHighlight from '@/utils/renderUserHighlight';
import { getState } from '@/utils/state';

const redrawHighlights = () => {
  const state = getState();

  state.highlights.remove();
  state.highlights.innerHTML = '';
  if (state.layout === 'fixed') {
    state.content.appendChild(state.highlights);
  }
  if (state.layout === 'flow') {
    state.wrapper.appendChild(state.highlights);
  }

  console.log('redrawHighlights');

  if (state.userHighlightsById?.size) {
    const highlights = Array.from(state.userHighlightsById.values());

    for (let i = 0, l = highlights.length; i < l; i++) {
      const highlight = highlights[i];
      if (highlight) {
        const domHighlights = renderUserHighlight(highlight);

        if (domHighlights) {
          state.domHighlightsById.set(highlight.id, domHighlights);
        }
      }
    }
  }
};

export default redrawHighlights;
