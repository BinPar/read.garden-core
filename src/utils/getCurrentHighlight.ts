import type { HighlighterType } from '@/@types/common';
import type { CoreHighlight } from '@/@types/selection';
import getId from '@/tools/getId';
import getDomHighlights from '@/utils/getDomHighlights';
import getNodeQuerySelector from '@/utils/getNodeQuerySelector';
import { getState } from '@/utils/state';

const getCurrentHighlight = ({
  range,
  text,
  color,
  type,
  highlighter,
}: {
  range: Range;
  text: string;
  color: string;
  type: HighlighterType;
  highlighter: string | number;
}): CoreHighlight => {
  const state = getState();

  const rects = Array.from(range.getClientRects());

  if (!rects.length) {
    console.error('No client rects for selection range');
  }

  const key = `hl-${getId()}`;
  const domHighlights = getDomHighlights({
    rects,
    highlighter,
    color,
    key,
    type,
  });

  for (let i = 0, l = domHighlights.length; i < l; i++) {
    const highlight = domHighlights[i];
    if (highlight) {
      state.highlights.appendChild(highlight);
    }
  }

  const selectionRange = {
    obfuscatedText: text,
    start: {
      offset: range.startOffset,
      querySelector: getNodeQuerySelector(range.startContainer),
    },
    end: {
      offset: range.endOffset,
      querySelector: getNodeQuerySelector(range.endContainer),
    },
  };

  const coreHighlight = {
    range,
    color,
    highlighter,
    key,
    text,
    type,
    domHighlights,
    selectionRange,
  };

  state.coreHighlightsByKey.set(key, coreHighlight);

  return coreHighlight;
};

export default getCurrentHighlight;
