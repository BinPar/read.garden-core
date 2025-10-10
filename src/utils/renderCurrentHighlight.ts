import type { HighlighterType } from '@/@types/common';
import getId from '@/tools/getId';
import clearSelection from '@/utils/clearSelection';
import dispatchEvent from '@/utils/events/dispatchEvent';
import getDomHighlights from '@/utils/getDomHighlights';
import getNodeQuerySelector from '@/utils/getNodeQuerySelector';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import { getState } from '@/utils/state';

const renderCurrentHighlight = ({
  highlighter,
  color,
  type,
}: {
  highlighter: string | number;
  color: string;
  type: HighlighterType;
  isTemporary?: boolean;
}) => {
  const state = getState();

  if (!state.currentSelection) {
    console.error(
      'No highlight, selection ranges or selected text at renderHighlight',
    );
    return;
  }

  const { range, text } = state.currentSelection;
  const rects = Array.from(range.getClientRects());

  if (!rects.length) {
    console.error('No client rects for selection range');
    return;
  }

  const key = `hl-${getId()}`;
  // Determine which content container the range belongs to (work with Text nodes)
  let sideOverride: 'left' | 'right' | undefined;
  if (state.pageLayout === 'double' && state.contentRight) {
    sideOverride = state.contentRight.contains(range.startContainer)
      ? 'right'
      : 'left';
  }
  const domHighlights = getDomHighlights({
    rects,
    highlighter,
    color,
    key,
    type,
    sideOverride,
  });

  for (let i = 0, l = domHighlights.length; i < l; i++) {
    const highlight = domHighlights[i];
    if (highlight) {
      const side = highlight.dataset.side;
      if (side === 'right' && state.highlightsRight) {
        state.highlightsRight.appendChild(highlight);
      } else {
        state.highlights.appendChild(highlight);
      }
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

  state.coreHighlightsByKey.set(key, {
    color,
    domHighlights,
    highlighter,
    key,
    range,
    selectionRange,
    text,
    type,
  });

  dispatchEvent({
    type: 'onNewHighlight',
    highlighter,
    key,
    range: selectionRange,
  });
  clearSelection();
  hideSelectionMenu();
};

export default renderCurrentHighlight;
