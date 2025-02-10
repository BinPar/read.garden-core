import type { HighlighterType } from '@/@types/common';
import clearSelection from '@/utils/clearSelection';
import dispatchEvent from '@/utils/events/dispatchEvent';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
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
    `--top: ${top}px; --left: ${left}px; --width: ${width}px; --height: ${height}px; --highlighter-color: ${color}; display: var(--highlighter-${highlighter}-display, block)`,
  );
  highlight.dataset.key = key;
  highlight.dataset.highlighter = `${highlighter}`;
  highlight.dataset.type = type;

  if (id) {
    highlight.dataset.id = `${id}`;
  }

  highlight.onpointerdown = (event) => {
    preventAndStopPropagation(event);
    clearSelection();
    if (highlight.dataset.id) {
      dispatchEvent({
        type: 'onHighlightClick',
        id: highlight.dataset.id,
      });
    }
  };

  highlight.onpointerup = preventAndStopPropagation;

  return highlight;
};

export default getDomHighlight;
