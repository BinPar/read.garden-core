import type { HighlighterType } from '@/@types/common';
import isWebKit from '@/tools/isWebKit';
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
  sideOverride,
}: {
  rects: DOMRect[];
  highlighter: string | number;
  color: string;
  key: string;
  type: HighlighterType;
  id?: string | number;
  sideOverride?: 'left' | 'right';
}) => {
  const state = getState();
  const config = getConfig();
  const scale = getScale();
  const highlights = new Array<HTMLDivElement>();

  if (state.layout === 'fixed') {
    const contentRect = state.content.getBoundingClientRect();
    const contentRightRect = state.contentRight?.getBoundingClientRect();
    for (let i = 0, l = rects.length; i < l; i++) {
      const rect = rects[i];
      if (rect) {
        let top, left, width, height;
        const computedRight =
          state.pageLayout === 'double' &&
          !!contentRightRect &&
          rect.left >= contentRightRect.left;
        const isRightPage = sideOverride
          ? sideOverride === 'right'
          : computedRight;
        const baseRect =
          isRightPage && contentRightRect ? contentRightRect : contentRect;
        const leftPadding =
          state.pageLayout === 'double' ? 5 : config.padding.left;

        if (isWebKit()) {
          top = rect.top - baseRect.top - config.padding.top / scale;
          left =
            state.pageLayout === 'double'
              ? rect.left - baseRect.left - leftPadding
              : rect.left - baseRect.left - leftPadding / scale;
          width = rect.width;
          height = rect.height;
        } else {
          top = (rect.top - baseRect.top - config.padding.top) / scale;
          left =
            state.pageLayout === 'double'
              ? (rect.left - baseRect.left) / scale - leftPadding
              : (rect.left - baseRect.left - leftPadding) / scale;
          width = rect.width / scale;
          height = rect.height / scale;
        }

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
            side: isRightPage ? 'right' : 'left',
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
