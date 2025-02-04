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
      console.log(`Using iframe for ${url}`);
      const state = getState();
      const iframe = state.doc.createElement('iframe');
      iframe.setAttribute('crossOrigin', 'anonymous');
      iframe.referrerPolicy = 'no-referrer';
      iframe.addEventListener('load', () => {
        let html =
          (iframe.contentDocument ?? iframe.contentWindow?.document)?.body
            .innerHTML ?? '';
        console.log(`Loaded iframe from ${url} with html: ${!!html}`);
        if (html) {
          if (replacements.length) {
            for (let i = 0, l = replacements.length; i < l; i++) {
              const replacement = replacements[i];
              if (replacement) {
                const [replaceThis, forThis] = replacement;
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
          // iframe.remove();
        }
      });
      iframe.onerror = reject;
      state.preload.appendChild(iframe);
      iframe.src = url;
    } catch (ex) {
      reject(ex as Error);
    }
  });

export default loadContentFromIframe;
