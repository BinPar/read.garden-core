import loadContent from '@/utils/loadContent';
import { getState, updateState } from '@/utils/state';

const navigateToContentSlug = (contentSlug: string) => {
  const state = getState();

  const content = state.contentsBySlug?.get(contentSlug);

  if (!content) {
    console.warn(`Couldn't find content with slug ${contentSlug}`);
    return;
  }

  if (state.layout === 'flow') {
    if (content.order === state.contentOrder) {
      const snap = state.snapByContent.get(contentSlug);
      if (!snap) {
        console.warn(`Couldn't find snap position for content ${contentSlug}`);
        return;
      }
      state.wrapper.scrollTo({
        left: snap,
      });
      return;
    }

    updateState(
      {
        previousContent: contentSlug,
      },
      true,
    );
  }

  loadContent(content);
};

export default navigateToContentSlug;
