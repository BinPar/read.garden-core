import type { ActionHandler, ConfirmHighlight } from '@/@types/actions';

const confirmHighlight: ActionHandler<ConfirmHighlight> = ({
  action,
  state,
}) => {
  const highlights = state.domHighlightsByKey.get(action.key);

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

  const highlight = state.userHighlightsByKey.get(action.key);

  if (highlight) {
    state.userHighlightsById.set(action.id, {
      ...highlight,
      id: action.id,
      // note ?
    });
    state.userHighlightsByKey.delete(action.key);
  }

  state.domHighlightsByKey.delete(action.key);
  state.domHighlightsById.set(action.id, highlights);
};

export default confirmHighlight;
