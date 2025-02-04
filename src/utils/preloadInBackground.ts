import genericCatch from '@/tools/genericCatch';
import { getConfig } from '@/utils/config';
import loadContentFromIframe from '@/utils/loadContentFromIframe';
import preloadImages from '@/utils/preloadImages';
import { getState } from '@/utils/state';
import {
  getWorker,
  type DownloadWorkerResponse,
} from '@/utils/workers/download';

const preloadInBackground = () => {
  window.requestIdleCallback(() => {
    const state = getState();
    const config = getConfig();

    if (!state.pendingContents.size || !config.baseUrl) {
      return;
    }

    if (!state.orderedContents) {
      throw new Error('Missing contents by order map');
    }

    const currentContent = state.contentOrder;
    let direction = 1;
    let forward = 1;
    let backward = 0;

    let orderToLoad = currentContent + forward;

    while (
      !state.pendingContents.has(orderToLoad) &&
      orderToLoad >= 0 &&
      orderToLoad < state.orderedContents.length
    ) {
      if (direction % 2) {
        forward++;
        orderToLoad = currentContent + forward;
        if (currentContent - backward > 0) {
          direction++;
        }
      } else {
        backward++;
        orderToLoad = currentContent - backward;
        if (currentContent + forward < state.orderedContents.length) {
          direction++;
        }
      }
    }

    if (
      !state.pendingContents.has(orderToLoad) ||
      state.loadingContents.has(orderToLoad)
    ) {
      return;
    }

    const content = state.orderedContents.at(orderToLoad);
    if (!content) {
      return;
    }

    if (content.html) {
      state.pendingContents.delete(content.order);
      return preloadInBackground();
    }

    state.loadingContents.add(content.order);

    const replacements = new Array<[string, string]>();
    const url = `${config.baseUrl}/${content.file}`;

    if (config.baseUrl.startsWith('file://')) {
      const [domain] = config.baseUrl.split('/contents');
      if (domain) {
        replacements.push(['%%CDN%%', domain]);
      }
    } else {
      const { protocol, host } = new URL(config.baseUrl);
      const domain = `${protocol}//${host}`;
      replacements.push(['%%CDN%%', domain]);
    }

    if (url.startsWith('file://')) {
      const [domain] = config.baseUrl.split('/contents');
      if (domain) {
        replacements.push(['%%CDN%%', domain]);
      }
      loadContentFromIframe(url, replacements)
        .then(({ html, images }) => {
          console.log(
            `Loaded from iframe content ${content.order} html: ${html}`,
          );
          state.loadingContents.delete(content.order);
          if (html) {
            content.html = html;
            state.pendingContents.delete(content.order);
            preloadInBackground();
            preloadImages(images);
          }
        })
        .catch(
          genericCatch('Exception loading preloading content from iframe'),
        );
      return;
    }

    const { protocol, host } = new URL(config.baseUrl);
    const domain = `${protocol}//${host}`;

    const worker = getWorker();

    worker.onmessage = function (e) {
      const { html, images } = e.data as DownloadWorkerResponse;
      state.loadingContents.delete(content.order);
      content.html = html;
      state.pendingContents.delete(content.order);
      preloadInBackground();
      preloadImages(images);
    };

    worker.onerror = function (e) {
      console.error('Error at download worker: ', e);
    };

    worker.postMessage({ url, replacements: [['%%CDN%%', domain]] });
  });
};

export default preloadInBackground;
