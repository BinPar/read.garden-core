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
      console.log('antes del delete')
      console.log({
        id,
        domHighlights: Array.from(domHighlightsById.keys()),
        userHighlights: Array.from(userHighlightsById.keys()),
      });

      domHighlightsById.delete(id);
      userHighlightsById.delete(id);
      console.log('despues del delete')
      console.log({
        domHighlights: Array.from(domHighlightsById.keys()),
        userHighlights: Array.from(userHighlightsById.keys()),
      });
    }
  }
};

export default removeHighlights;
