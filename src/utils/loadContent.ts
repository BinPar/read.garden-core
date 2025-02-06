import type { CoreContent } from '@/@types';
import genericCatch from '@/tools/genericCatch';
import { getConfig } from '@/utils/config';
import downloadHtml from '@/utils/downloadHtml';
import dispatchEvent from '@/utils/events/dispatchEvent';
import preloadInBackground from '@/utils/preloadInBackground';
import renderContent from '@/utils/renderContent';
import { getState, updateState } from '@/utils/state';

const loadContent = (content: CoreContent) => {
  const state = getState();
  const config = getConfig();

  const onHtmlLoaded = (html: string) => {
    renderContent(html);
    updateState({
      contentOrder: content.order,
    });

    if (state.layout === 'fixed') {
      updateState({
        contentSlug: content.slug,
      });
      // FYI: in flow, contentSlug depends on scroll position
    }

    if (state.pendingContents) {
      preloadInBackground();
    }

    window.requestAnimationFrame(() => {
      dispatchEvent({
        type: 'contentLoaded',
        contentSlug: content.slug,
      });
    });
  };

  if (content.html) {
    onHtmlLoaded(content.html);
  } else if (config.baseUrl) {
    downloadHtml(`${config.baseUrl}/${content.file}`, config.baseUrl)
      .then((html) => {
        state.pendingContents.delete(content.order);
        content.html = html;
        onHtmlLoaded(content.html);
      })
      .catch(genericCatch('Exception downloading HTML'));
  }
};

export default loadContent;
