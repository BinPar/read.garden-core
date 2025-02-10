import type { HighlighterType } from '@/@types/common';
import { getState } from '@/utils/state';

const getDomHighlight = ({
  top,
  left,
  width,
  height,
  color,
  key,
  highlighter,
  type,
  id,
}: {
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  key: string;
  highlighter: string | number;
  type: HighlighterType;
  id?: string | number;
}) => {
  const state = getState();

  const highlight = state.doc.createElement('div');
  highlight.setAttribute(
    'style',
    `--top: ${top}px; --left: ${left}px; --width: ${width}px; --height: ${height}px; --color: ${color}; display: var(--highlighter-${highlighter}-display, block)`,
  );
  highlight.dataset.key = key;
  highlight.dataset.highlighter = `${highlighter}`;
  highlight.dataset.type = type;

  if (id) {
    highlight.dataset.id = `${id}`;
  }

  highlight.onpointerdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('highlight pointerdown');
  };

  highlight.onpointerup = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return highlight;
};

export default getDomHighlight;
