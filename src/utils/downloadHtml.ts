import preloadImages from '@/utils/preloadImages';
import { getState } from '@/utils/state';
import {
  getWorker,
  type DownloadWorkerResponse,
} from '@/utils/workers/download';

const downloadHtml = async (url: string, baseUrl?: string) =>
  new Promise<string>((resolve, reject) => {
    const replacements = new Array<[string, string]>();

    if (baseUrl) {
      const { protocol, host } = new URL(baseUrl);
      const domain = `${protocol}//${host}`;
      replacements.push(['%%CDN%%', domain]);
    }

    console.log(`Downloading ${url}`);
    if (url.startsWith('file://')) {
      try {
        console.log('Using iframe');
        const state = getState();
        const iframe = state.doc.createElement('iframe');
        iframe.onload = () => {
          let html = iframe.contentDocument?.body.innerHTML ?? '';
          if (html && replacements.length) {
            for (let i = 0, l = replacements.length; i < l; i++) {
              const replacement = replacements[i];
              if (replacement) {
                const [replaceThis, forThis] = replacement;
                html = html.split(replaceThis).join(forThis);
              }
            }
          }
          resolve(html);
          iframe.remove();
        };
        iframe.onerror = reject;
        state.preload.appendChild(iframe);
        iframe.src = url;
      } catch (ex) {
        reject(ex as Error);
      }
      return;
    }

    try {
      const worker = getWorker();

      worker.onmessage = (ev) => {
        const { html, images } = ev.data as DownloadWorkerResponse;
        resolve(html);
        preloadImages(images);
      };

      worker.onerror = reject;

      worker.postMessage({ url, replacements });
    } catch (ex) {
      reject(ex as Error);
    }
  });

export default downloadHtml;
