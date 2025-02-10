import type { HighlighterType } from '@/@types/common';
import getId from '@/tools/getId';
import clearSelection from '@/utils/clearSelection';
import { getConfig } from '@/utils/config';
import dispatchEvent from '@/utils/events/dispatchEvent';
import getDomHighlight from '@/utils/getDomHighlight';
import getNodeQuerySelector from '@/utils/getNodeQuerySelector';
import getScale from '@/utils/getScale';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import { getState } from '@/utils/state';

export const getHighlights = ({
  rects,
  highlighter,
  color,
  key,
  type,
  id,
}: {
  rects: DOMRect[];
  highlighter: string | number;
  color: string;
  key: string;
  type: HighlighterType;
  id?: string | number;
}) => {
  const state = getState();
  const config = getConfig();
  const scale = getScale();
  const highlights = new Array<HTMLDivElement>();

  if (state.layout === 'fixed') {
    const contentRect = state.content.getBoundingClientRect();

    for (let i = 0, l = rects.length; i < l; i++) {
      const rect = rects[i];
      if (rect) {
        const top =
          (rect.top - contentRect.top - (config.padding.top ?? 0)) / scale;
        const left =
          (rect.left - contentRect.left - (config.padding.left ?? 0)) / scale;
        const width = rect.width / scale;
        const height = rect.height / scale;

        highlights.push(
          getDomHighlight({
            top,
            left,
            width,
            height,
            highlighter,
            color,
            key,
            type,
            id,
          }),
        );
      }
    }
  }

  if (state.layout === 'flow') {
    const startLeft = state.chapterStart.getBoundingClientRect().left;
    const wrapperTop = state.wrapper.getBoundingClientRect().top;

    for (let i = 0, l = rects.length; i < l; i++) {
      const rect = rects[i];
      if (rect) {
        const top = (rect.top - wrapperTop) / scale;
        const left = (rect.left - startLeft) / scale + state.columnGap / 2;
        const width = rect.width / scale;
        const height = rect.height / scale;

        highlights.push(
          getDomHighlight({
            top,
            left,
            width,
            height,
            highlighter,
            color,
            key,
            type,
            id,
          }),
        );
      }
    }
  }

  return highlights;
};

const renderHighlight = ({
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
  const highlights = getHighlights({
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

  return { key, range };
};

export default renderHighlight;
