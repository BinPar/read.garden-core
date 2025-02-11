import type { HighlighterType } from '@/@types/common';
import { getConfig } from '@/utils/config';
import getDomHighlight from '@/utils/getDomHighlight';
import getScale from '@/utils/getScale';
import { getState } from '@/utils/state';

const getDomHighlights = ({
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

export default getDomHighlights;
