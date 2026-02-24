import type { ActionHandler, RemoveHighlights } from '@/@types/actions';

const removeHighlights: ActionHandler<RemoveHighlights> = ({
  action,
  state,
}) => {
  const { domHighlightsById, userHighlightsById } = state;

  for (let i = 0, l = action.ids.length; i < l; i++) {
    const id = action.ids[i];
    if (id) {
      const domHighlights = domHighlightsById.get(id);

      if (domHighlights?.length) {
        domHighlights.forEach((domHighlight) => {
          domHighlight.remove();
        });
      }

      domHighlightsById.delete(id);
      userHighlightsById.delete(id);
    }
  }

  if (!userHighlightsById.size) {
    state.arrowNavigation.style.removeProperty('display');
  }
};

export default removeHighlights;
