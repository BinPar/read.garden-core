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
      const state = getState();
      const iframe = state.doc.createElement('iframe');
      state.preload.appendChild(iframe);
      iframe.setAttribute('crossOrigin', 'anonymous');
      iframe.referrerPolicy = 'no-referrer';
      iframe.src = url;
      iframe.onload = () => {
        let html =
          (iframe.contentDocument ?? iframe.contentWindow?.document)?.body
            .innerHTML ?? '';
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
          setTimeout(() => {
            iframe.remove();
          }, 1000);
        }
      };
      iframe.onerror = reject;
    } catch (ex) {
      reject(ex as Error);
    }
  });

export default loadContentFromIframe;
