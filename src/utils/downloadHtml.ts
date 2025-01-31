import preloadImages from '@/utils/preloadImages';
import { getState } from '@/utils/state';
import {
  getWorker,
  type DownloadWorkerResponse,
} from '@/utils/workers/download';

const downloadHtml = async (url: string, baseUrl?: string) =>
  new Promise<string>((resolve, reject) => {
    if (url.startsWith('file://')) {
      const state = getState();
      const iframe = state.doc.createElement('iframe');
      iframe.onload = () => {
        console.log('iframe loaded', iframe.contentDocument?.body.innerHTML);
        resolve(iframe.contentDocument?.body.innerHTML ?? '');
      };
      iframe.src = url;
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

      const replacements = new Array<[string, string]>();

      if (baseUrl) {
        const { protocol, host } = new URL(baseUrl);
        const domain = `${protocol}//${host}`;
        replacements.push(['%%CDN%%', domain]);
      }

      worker.postMessage({ url, replacements });
    } catch (ex) {
      reject(ex as Error);
    }
  });

export default downloadHtml;
