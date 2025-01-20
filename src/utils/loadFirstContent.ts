import { getConfig } from '@/utils/config';
import renderContent from '@/utils/renderContent';
import replaceUrls from '@/utils/replaceUrls';
import { getState } from '@/utils/state';

const loadFirstContent = async (contentSlug: string) => {
  const state = getState();
  const config = getConfig();

  if (state.contentsBySlug) {
    const content = state.contentsBySlug.get(contentSlug);

    if (content) {
      if (content.html) {
        state.content.innerHTML = content.html;
      } else if (config.baseUrl) {
        const response = await fetch(`${config.baseUrl}/${content.file}`, {
          credentials: 'include',
        });
        const html = await response.text();
        const processedHtml = replaceUrls(html);
        renderContent(processedHtml, state);
        content.html = processedHtml;
      }
    }
  }
};

export default loadFirstContent;
