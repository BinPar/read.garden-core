import { getConfig } from '@/utils/config';
import preloadImages from '@/utils/preloadImages';
import { getState } from '@/utils/state';
import {
  getWorker,
  type DownloadWorkerResponse,
} from '@/utils/workers/download';

const preloadInBackground = () => {
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

  // console.log({ orderToLoad });

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

  if (!state.pendingContents.has(orderToLoad)) {
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

  const { protocol, host } = new URL(config.baseUrl);
  const domain = `${protocol}//${host}`;
  const url = `${config.baseUrl}/${content.file}`;

  const worker = getWorker();

  worker.onmessage = function (e) {
    const { html, images } = e.data as DownloadWorkerResponse;
    content.html = html;
    state.pendingContents.delete(content.order);
    preloadInBackground();
    preloadImages(images);
  };

  worker.onerror = function (e) {
    console.error('Error at download worker: ', e);
  };

  worker.postMessage({ url, replacements: [['%%CDN%%', domain]] });
};

export default preloadInBackground;
