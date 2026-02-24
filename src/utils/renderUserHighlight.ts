import type { UserHighlight } from '@/@types/selection';
import getDomHighlights from '@/utils/getDomHighlights';
import getElementFromQuerySelector from '@/utils/getElementFromQuerySelector';
import { getState } from '@/utils/state';

const renderUserHighlight = (highlight: UserHighlight) => {
  const startContainer = getElementFromQuerySelector(
    highlight.range.start.querySelector,
  );
  if (!startContainer) {
    return;
  }

  const endContainer = getElementFromQuerySelector(
    highlight.range.end.querySelector,
  );
  if (!endContainer) {
    return;
  }

  const range = new Range();
  range.setStart(startContainer, highlight.range.start.offset);
  range.setEnd(endContainer, highlight.range.end.offset);
  const rects = range.getClientRects();

  if (!rects.length) {
    return;
  }

  // Determine which content container the stored range belongs to when in double-page
  const state = getState();
  let sideOverride: 'left' | 'right' | undefined;
  if (state.pageLayout === 'double' && state.contentRight) {
    // Use contains to avoid calling closest on Node (Text may not be Element)
    sideOverride = state.contentRight.contains(startContainer) ? 'right' : 'left';
  }

  const highlights = getDomHighlights({
    rects: Array.from(rects),
    color: highlight.color,
    highlighter: highlight.highlighter,
    key: `${highlight.id}`,
    id: highlight.id,
    type: highlight.type,
    sideOverride,
  });

  

  for (let j = 0, m = highlights.length; j < m; j++) {
    const highlightElement = highlights[j];
    if (highlightElement) {
      const side = highlightElement.dataset.side;
      if (side === 'right' && state.highlightsRight) {
        state.highlightsRight.appendChild(highlightElement);
      } else {
        state.highlights.appendChild(highlightElement);
      }
    }
  }

  return highlights;
};

export default renderUserHighlight;
