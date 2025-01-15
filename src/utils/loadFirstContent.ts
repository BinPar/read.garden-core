import { getConfig } from '@/utils/config';
import flowSetup from '@/utils/flow/setup';
import replaceUrls from '@/utils/replaceUrls';
import { getState } from '@/utils/state';

const loadFirstContent = async (contentSlug: string) => {
  const state = getState();
  const config = getConfig();

  if (state.contentsBySlug) {
    const content = state.contentsBySlug.get(contentSlug);

    console.log({ content, contentSlug });

    if (content) {
      if (content.html) {
        state.content.innerHTML = content.html;
      } else if (config.baseUrl) {
        const response = await fetch(`${config.baseUrl}/${content.file}`, {
          credentials: 'include',
        });
        const html = await response.text();
        const processedHtml = replaceUrls(html);
        state.content.innerHTML = processedHtml;
        content.html = processedHtml;

        const chapterStart = state.doc.createElement('div');
        chapterStart.id = 'chapter-start';
        state.content.insertAdjacentElement('beforebegin', chapterStart);

        const inlineEnd = state.doc.createElement('div');
        inlineEnd.id = 'inline-end';
        state.wrapper.insertAdjacentElement('afterend', inlineEnd);

        const chapterEnd = state.doc.createElement('div');
        chapterEnd.id = 'chapter-end';
        state.wrapper.insertAdjacentElement('afterend', chapterEnd);
      }
    }
  }

  if (state.layout === 'flow') {
    flowSetup();

    // recalculate
  }

  // if (layout === 'fixed') {
  //   // fixedSetup
  // }
};

export default loadFirstContent;
