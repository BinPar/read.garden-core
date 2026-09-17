import type { HighlighterType } from '@/@types/common';
import { getConfig } from '@/utils/config';
import getDomHighlight from '@/utils/getDomHighlight';
import getScale from '@/utils/getScale';
import { getState } from '@/utils/state';

const rectTolerance = 1;

interface HighlightRow {
  bottom: number;
  bottomInset: number;
  height: number;
  rects: DOMRect[];
  top: number;
  topInset: number;
}

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
  const sortedRects = rects.slice().sort((currentRect, nextRect) => {
    if (currentRect.top === nextRect.top) {
      return currentRect.left - nextRect.left;
    }

    return currentRect.top - nextRect.top;
  });
  const rows = new Array<HighlightRow>();

  for (let i = 0, l = sortedRects.length; i < l; i++) {
    const rect = sortedRects[i];
    const previousRow = rows[rows.length - 1];

    if (!rect) {
      continue;
    }

    if (!previousRow) {
      rows.push({
        bottom: rect.bottom,
        bottomInset: 0,
        height: rect.height,
        rects: [rect],
        top: rect.top,
        topInset: 0,
      });
      continue;
    }

    const rectCenter = rect.top + rect.height / 2;
    const previousRowCenter = previousRow.top + previousRow.height / 2;
    const maximumRowHeight = Math.max(rect.height, previousRow.height);
    const isSameVisualRow =
      Math.abs(rectCenter - previousRowCenter) <= maximumRowHeight / 2;

    if (isSameVisualRow) {
      previousRow.rects.push(rect);
      previousRow.top = Math.min(previousRow.top, rect.top);
      previousRow.bottom = Math.max(previousRow.bottom, rect.bottom);
      previousRow.height = previousRow.bottom - previousRow.top;
      continue;
    }

    rows.push({
      bottom: rect.bottom,
      bottomInset: 0,
      height: rect.height,
      rects: [rect],
      top: rect.top,
      topInset: 0,
    });
  }

  for (let i = 0, l = rows.length; i < l; i++) {
    const row = rows[i];

    if (!row) {
      continue;
    }

    const mergedRowRects = new Array<DOMRect>();
    const sortedRowRects = row.rects
      .slice()
      .sort((currentRect, nextRect) => currentRect.left - nextRect.left);

    for (let j = 0, k = sortedRowRects.length; j < k; j++) {
      const rect = sortedRowRects[j];
      const previousRect = mergedRowRects[mergedRowRects.length - 1];

      if (!rect || !previousRect) {
        if (rect) {
          mergedRowRects.push(
            new DOMRect(rect.left, row.top, rect.width, row.height),
          );
        }
        continue;
      }

      const isContiguous = rect.left <= previousRect.right + rectTolerance;

      if (!isContiguous) {
        mergedRowRects.push(
          new DOMRect(rect.left, row.top, rect.width, row.height),
        );
        continue;
      }

      const left = Math.min(previousRect.left, rect.left);
      const right = Math.max(previousRect.right, rect.right);

      mergedRowRects[mergedRowRects.length - 1] = new DOMRect(
        left,
        row.top,
        right - left,
        row.height,
      );
    }

    row.rects = mergedRowRects;
  }

  const outlineWidth = 2 * scale;

  for (let i = 0, l = rows.length - 1; i < l; i++) {
    const currentRow = rows[i];
    const nextRow = rows[i + 1];

    if (!currentRow || !nextRow) {
      continue;
    }

    const visualOverlap =
      currentRow.bottom + outlineWidth - (nextRow.top - outlineWidth);

    if (visualOverlap > 0) {
      const verticalInset = visualOverlap / 2;
      currentRow.bottomInset += verticalInset;
      nextRow.topInset += verticalInset;
    }
  }

  const normalizedRects = new Array<DOMRect>();

  for (let i = 0, l = rows.length; i < l; i++) {
    const row = rows[i];

    if (!row) {
      continue;
    }

    for (let j = 0, k = row.rects.length; j < k; j++) {
      const rect = row.rects[j];

      if (!rect) {
        continue;
      }

      const top = rect.top + row.topInset;
      const bottom = rect.bottom - row.bottomInset;

      if (bottom > top) {
        normalizedRects.push(
          new DOMRect(rect.left, top, rect.width, bottom - top),
        );
      }
    }
  }

  if (state.layout === 'fixed') {
    const contentRect = state.content.getBoundingClientRect();
    const contentRightRect = state.contentRight?.getBoundingClientRect();
    for (let i = 0, l = normalizedRects.length; i < l; i++) {
      const rect = normalizedRects[i];
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

        top = (rect.top - baseRect.top - config.padding.top) / scale;
        left =
          state.pageLayout === 'double'
            ? (rect.left - baseRect.left) / scale - leftPadding
            : (rect.left - baseRect.left - leftPadding) / scale;
        width = rect.width / scale;
        height = rect.height / scale;

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

    for (let i = 0, l = normalizedRects.length; i < l; i++) {
      const rect = normalizedRects[i];
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
