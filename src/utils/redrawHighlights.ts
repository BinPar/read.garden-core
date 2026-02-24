import renderUserHighlight from '@/utils/renderUserHighlight';
import { getState } from '@/utils/state';

const redrawHighlights = () => {
  const state = getState();

  state.highlights.innerHTML = '';
  if (state.highlightsRight) {
    state.highlightsRight.innerHTML = '';
  }

  if (state.layout === 'fixed') {
    state.content.appendChild(state.highlights);
    if (
      state.pageLayout === 'double' &&
      state.contentRight &&
      state.highlightsRight
    ) {
      state.contentRight.appendChild(state.highlightsRight);
    }
  }
  if (state.layout === 'flow') {
    state.wrapper.appendChild(state.highlights);
  }

  let hasRenderedHighlights = false;

  if (state.userHighlightsById?.size) {
    const highlights = Array.from(state.userHighlightsById.values());

    for (let i = 0, l = highlights.length; i < l; i++) {
      const highlight = highlights[i];
      if (highlight) {
        const domHighlights = renderUserHighlight(highlight);

        if (domHighlights?.length) {
          hasRenderedHighlights = true;
          state.domHighlightsById.set(highlight.id, domHighlights);
        }
      }
    }
  }

  if (!hasRenderedHighlights) {
    state.arrowNavigation.style.removeProperty('display');
  }
};

export default redrawHighlights;
