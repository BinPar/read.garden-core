import type { CoreContent } from '@/@types';
import { getConfig } from '@/utils/config';
import downloadHtml from '@/utils/downloadHtml';
import preloadContents from '@/utils/preloadContents';
import renderContent from '@/utils/renderContent';
import { getState, updateState } from '@/utils/state';

const loadContent = async (content: CoreContent) => {
  const state = getState();
  const config = getConfig();

  if (content.html) {
    renderContent(content.html, state);
  } else if (config.baseUrl) {
    const html = await downloadHtml(`${config.baseUrl}/${content.file}`);
    state.pendingContents.delete(content.order);
    renderContent(html, state);
    content.html = html;
  }

  updateState({
    contentSlug: content.slug,
    contentOrder: content.order,
  });

  if (state.pendingContents) {
    preloadContents(content.order);
  }
};

export default loadContent;
