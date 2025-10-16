import { getConfig } from '@/utils/config';
import loadContent from '@/utils/loadContent';
import { getState } from '@/utils/state';

const loadContentBySlug = (contentSlug: string) => {
  const state = getState();
  if (!state.contentsBySlug) {
    throw new Error('Missing contents by slug map');
  }

  let content = state.contentsBySlug.get(contentSlug);

  if (!content) {
    console.warn(
      `No content found for content slug: ${contentSlug}, trying to use initialContentSlug`,
    );
    const config = getConfig();
    if (config.jsonData?.initialContentSlug) {
      content = state.contentsBySlug.get(config.jsonData.initialContentSlug);
    }
  }

  if (content) {
    loadContent(content);
  }
};

export default loadContentBySlug;
