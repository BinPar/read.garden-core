import type { CoreContent } from '@/@types';
import { getConfig } from '@/utils/config';
import downloadHtml from '@/utils/downloadHtml';
import preloadInBackground from '@/utils/preloadInBackground';
import renderContent from '@/utils/renderContent';
import { getState, updateState } from '@/utils/state';

const loadContent = async (content: CoreContent) => {
  const state = getState();
  const config = getConfig();

  if (content.html) {
    renderContent(content.html, state);
  } else if (config.baseUrl) {
    const html = await downloadHtml(
      `${config.baseUrl}/${content.file}`,
      config.baseUrl,
    );
    state.pendingContents.delete(content.order);
    renderContent(html, state);
    content.html = html;
  }

  updateState({
    contentOrder: content.order,
  });

  if (state.layout === 'fixed') {
    updateState({
      contentSlug: content.slug,
    });
    // In flow, contentSlug is handled by wrapper scroll
  }

  if (state.pendingContents) {
    preloadInBackground();
  }
};

export default loadContent;
