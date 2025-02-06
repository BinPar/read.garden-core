import { getState } from '@/utils/state';

const getDomHighlight = ({
  top,
  left,
  width,
  height,
  color,
  key,
}: {
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  key: string;
}) => {
  const state = getState();

  const highlight = state.doc.createElement('div');
  highlight.setAttribute(
    'style',
    `--top: ${top}px; --left: ${left}px; --width: ${width}px; --height: ${height}px; --color: ${color}`,
  );
  highlight.dataset.key = key;
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
