import loadContent from '@/utils/loadContent';
import { getState } from '@/utils/state';

const loadContentBySlug = async (contentSlug: string) => {
  const state = getState();

  if (!state.contentsBySlug) {
    throw new Error('Missing contents by slug map');
  }

  const content = state.contentsBySlug.get(contentSlug);

  if (content) {
    await loadContent(content);
  }
};

export default loadContentBySlug;
