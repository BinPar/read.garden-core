import type { ActionHandler, ConfirmHighlight } from '@/@types/actions';

const confirmHighlight: ActionHandler<ConfirmHighlight> = ({
  action,
  state,
}) => {
  const highlight = state.coreHighlightsByKey.get(action.key);

  if (!highlight) {
    console.error(`No highlight found with key: ${action.key}`);
    return;
  }

  for (let i = 0, l = highlight.domHighlights.length; i < l; i++) {
    const domHighlight = highlight.domHighlights[i];
    if (domHighlight) {
      domHighlight.dataset.id = `${action.id}`;
    }
  }

  state.domHighlightsById.set(action.id, highlight.domHighlights);
  state.userHighlightsById.set(action.id, {
    id: action.id,
    color: highlight.color,
    highlighter: highlight.highlighter,
    range: highlight.selectionRange,
    type: highlight.type,
    note: highlight.note,
  });
  state.coreHighlightsByKey.delete(action.key);
};

export default confirmHighlight;
