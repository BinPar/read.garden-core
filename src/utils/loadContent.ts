import type { CoreContent } from '@/@types/common';
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

  const onHtmlLoaded = async (html: string) => {
    // If in fixed double layout, try to render next content on the right
    if (state.layout === 'fixed' && state.pageLayout === 'double' && state.contentRight) {
      let rightHtml: string | undefined;
      const rightContent = content.next;
      if (rightContent) {
        // Use cached html if available
        if (rightContent.html) {
          rightHtml = rightContent.html;
          updateState({ rightContentSlug: rightContent.slug });
        } else if (config.baseUrl) {
          let htmlR = '';
          try {
            htmlR = await downloadHtml(
              `${config.baseUrl}/${rightContent.file}`,
              config.baseUrl,
            );
          } catch (ex) {
            genericCatch('Exception downloading RIGHT HTML')(ex);
          }

          rightContent.html = htmlR;
          const current = getState();

          if (current.contentRight) {
            rightHtml = htmlR;
            updateState({ rightContentSlug: rightContent.slug });
          }
        }
      } else {
        state.contentRight.innerHTML = '';
        updateState({ rightContentSlug: undefined });
      }
      console.log('🚀 ~ onHtmlLoaded ~ renderContent:');
      renderContent(html, rightHtml);
    } else {
      renderContent(html);
    }
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
    onHtmlLoaded(content.html).catch(genericCatch('Exception loading HTML'));
  } else if (config.baseUrl) {
    downloadHtml(`${config.baseUrl}/${content.file}`, config.baseUrl)
      .then((html) => {
        state.pendingContents.delete(content.order);
        content.html = html;
        onHtmlLoaded(content.html).catch(
          genericCatch('Exception loading HTML'),
        );
      })
      .catch(genericCatch('Exception downloading HTML'));
  }
};

export default loadContent;
