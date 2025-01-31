import nonNullable from '@/tools/nonNullable';
import { getState } from '@/utils/state';
import type { DownloadWorkerResponse } from '@/utils/workers/download';

const loadContentFromIframe = (
  url: string,
  replacements: [string, string][],
  withoutImages?: boolean,
) =>
  new Promise<DownloadWorkerResponse>((resolve, reject) => {
    try {
      console.log('Using iframe');
      const state = getState();
      const iframe = state.doc.createElement('iframe');
      iframe.onload = () => {
        let html = iframe.contentDocument?.body.innerHTML ?? '';
        if (replacements.length) {
          for (let i = 0, l = replacements.length; i < l; i++) {
            const replacement = replacements[i];
            if (replacement) {
              const [replaceThis, forThis] = replacement;
              console.log(`Replacing ${replaceThis} with ${forThis}`);
              html = html.split(replaceThis).join(forThis);
            }
          }
        }
        resolve({
          html,
          images: withoutImages
            ? []
            : Array.from(html.matchAll(/<img[^>]+src="([^">]+)"/g))
                .map((img) => img[1])
                .filter(nonNullable),
        });
        iframe.remove();
      };
      iframe.onerror = reject;
      state.preload.appendChild(iframe);
      iframe.src = url;
    } catch (ex) {
      reject(ex as Error);
    }
  });

export default loadContentFromIframe;
