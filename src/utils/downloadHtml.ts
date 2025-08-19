import { getConfig } from '@/utils/config';
import getDomainForImages from '@/utils/getDomainForImages';
import loadContentFromIframe from '@/utils/loadContentFromIframe';
import preloadImages from '@/utils/preloadImages';
import {
  getWorker,
  type DownloadWorkerResponse,
} from '@/utils/workers/download';

const downloadHtml = async (url: string, baseUrl?: string) =>
  new Promise<string>((resolve, reject) => {
    const replacements = new Array<[string, string]>();
    const config = getConfig();
    if (baseUrl) {
      if (baseUrl.startsWith('file://')) {
        const domain = config.localBaseUrl ?? baseUrl.split('/contents')?.[0];
        if (domain) {
          replacements.push(['%%CDN%%', domain]);
        }
      } else {
        const domain = getDomainForImages();
        replacements.push(['%%CDN%%', domain]);
      }
    }

    if (url.startsWith('file://')) {
      loadContentFromIframe(url, replacements, true)
        .then(({ html, images }) => {
          resolve(html);
          preloadImages(images);
        })
        .catch(reject);
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
