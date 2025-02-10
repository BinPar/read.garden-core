import type { ActionHandler, ConfirmHighlight } from '@/@types/actions';

const confirmHighlight: ActionHandler<ConfirmHighlight> = ({
  action,
  state,
}) => {
  const highlights = state.highlightsByKey.get(action.key);

  if (!highlights) {
    console.error(`No highlights found with key: ${action.key}`);
    return;
  }

  for (let i = 0, l = highlights.length; i < l; i++) {
    const highlight = highlights[i];
    if (highlight) {
      highlight.dataset.id = `${action.id}`;
    }
  }

  state.highlightsByKey.delete(action.key);
  state.highlightsById.set(action.id, highlights);
};

export default confirmHighlight;
