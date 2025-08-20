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

  const highlights = getDomHighlights({
    rects: Array.from(rects),
    color: highlight.color,
    highlighter: highlight.highlighter,
    key: `${highlight.id}`,
    id: highlight.id,
    type: highlight.type,
  });

  const state = getState();

  for (let j = 0, m = highlights.length; j < m; j++) {
    const highlightElement = highlights[j];
    if (highlightElement) {
      state.highlights.appendChild(highlightElement);
    }
  }

  return highlights;
};

export default renderUserHighlight;
