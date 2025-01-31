import loadContentFromIframe from '@/utils/loadContentFromIframe';
import preloadImages from '@/utils/preloadImages';
import {
  getWorker,
  type DownloadWorkerResponse,
} from '@/utils/workers/download';

const downloadHtml = async (url: string, baseUrl?: string) =>
  new Promise<string>((resolve, reject) => {
    const replacements = new Array<[string, string]>();

    if (baseUrl) {
      if (baseUrl.startsWith('file://')) {
        const [domain] = baseUrl.split('/contents');
        if (domain) {
          replacements.push(['%%CDN%%', domain]);
        }
      } else {
        const { protocol, host } = new URL(baseUrl);
        const domain = `${protocol}//${host}`;
        replacements.push(['%%CDN%%', domain]);
      }
    }

    console.log(`Downloading ${url}`);
    if (url.startsWith('file://')) {
      loadContentFromIframe(url, replacements, true)
        .then(({ html }) => {
          console.log(`Iframe loaded with HTML: ${html}`);
          resolve(html);
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
