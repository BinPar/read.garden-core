import type { ActionHandler, CancelHighlight } from '@/@types/actions';

const cancelHighlight: ActionHandler<CancelHighlight> = ({ action, state }) => {
  const highlight = state.coreHighlightsByKey.get(action.key);

  if (!highlight) {
    console.error(`No highlight found with key: ${action.key}`);
    return;
  }

  for (let i = 0, l = highlight.domHighlights.length; i < l; i++) {
    highlight.domHighlights[i]?.remove();
  }

  state.coreHighlightsByKey.delete(action.key);
};

export default cancelHighlight;
