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
  isTemporaryNote = false,
}: {
  highlighter: string | number;
  color: string;
  type: HighlighterType;
  isTemporaryNote?: boolean;
}) => {
  const state = getState();

  if (!state.selectionRanges?.length || !state.selectedText) {
    console.error(
      'No highlight, selection ranges or selected text at renderHighlight',
    );
    return;
  }

  const [range] = state.selectionRanges as [Range];
  const rects = Array.from(range.getClientRects());

  if (!rects.length) {
    console.error('No client rects for selection range');
  }

  const key = `hl-${getId()}`;
  const highlights = getDomHighlights({
    rects,
    highlighter,
    color,
    key,
    type,
  });

  for (let i = 0, l = highlights.length; i < l; i++) {
    const highlight = highlights[i];
    if (highlight) {
      state.highlights.appendChild(highlight);
    }
  }

  state.highlightsByKey.set(key, highlights);

  if (!isTemporaryNote) {
    dispatchEvent({
      type: 'onNewHighlight',
      highlighter,
      key,
      range: {
        obfuscatedText: state.selectedText,
        start: {
          offset: range.startOffset,
          querySelector: getNodeQuerySelector(range.startContainer),
        },
        end: {
          offset: range.endOffset,
          querySelector: getNodeQuerySelector(range.endContainer),
        },
      },
    });
  }

  clearSelection();
  hideSelectionMenu();

  return { key, range, highlights };
};

export default renderCurrentHighlight;
