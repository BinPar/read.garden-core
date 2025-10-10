import type { HighlighterType } from '@/@types/common';
import clearSelection from '@/utils/clearSelection';
import dispatchEvent from '@/utils/events/dispatchEvent';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import { getState, updateState } from '@/utils/state';

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
  side,
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
  side?: 'left' | 'right';
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
  if (side) {
    highlight.dataset.side = side;
  }

  if (id) {
    highlight.dataset.id = `${id}`;
  }

  highlight.onpointerdown = (event) => {
    preventAndStopPropagation(event);
    clearSelection();
    if (highlight.dataset.id) {
      if (type === 'highlighter') {
        updateState({ clickedHighlight: id });
        dispatchEvent({
          type: 'onHighlightClick',
          id: highlight.dataset.id,
          highlighterType: type,
        });
      }
      if (type === 'note') {
        updateState({ clickedNoteHighlight: id });
      }
    }
  };

  highlight.onpointerup = preventAndStopPropagation;

  return highlight;
};

export default getDomHighlight;
