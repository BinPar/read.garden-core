import type { ActionHandler, CancelHighlight } from '@/@types/actions';

const cancelHighlight: ActionHandler<CancelHighlight> = ({ action, state }) => {
  const highlights = state.domHighlightsByKey.get(action.key);

  if (!highlights) {
    console.error(`No highlights found with key: ${action.key}`);
    return;
  }

  for (let i = 0, l = highlights.length; i < l; i++) {
    const highlight = highlights[i];
    if (highlight) {
      highlight.remove();
    }
  }

  state.domHighlightsByKey.delete(action.key);
};

export default cancelHighlight;
