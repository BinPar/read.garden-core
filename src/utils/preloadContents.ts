import genericCatch from '@/tools/genericCatch';
import { getConfig } from '@/utils/config';
import downloadHtml from '@/utils/downloadHtml';
import { getState } from '@/utils/state';

let timeout: NodeJS.Timeout | undefined = undefined;

const getIndexes = (maxIndex: number, initialIndex = 0) => {
  const state = getState();
  const indexes = new Array<number>();

  if (!state.pendingContents.size) {
    return indexes;
  }

  let start = initialIndex;

  while (!state.pendingContents.has(start) && start < maxIndex) {
    ++start;
  }

  for (
    let i = start, j = 0;
    i <= maxIndex && i >= 0 && indexes.length < 5;
    ++j, i += j % 2 ? j : -j
  ) {
    if (state.pendingContents.has(i)) {
      indexes.push(i);
    }
  }

  return indexes;
};

const preloadContents = (initialIndex?: number) => {
  clearTimeout(timeout);
  const state = getState();
  if (!state.orderedContents) {
    throw new Error('Missing contents by order map');
  }

  const maxIndex = state.orderedContents.length - 1;
  const config = getConfig();
  const indexes = getIndexes(maxIndex, initialIndex);
  Promise.allSettled(
    indexes.map((index) => {
      return new Promise<number>((resolve, reject) => {
        try {
          if (state.orderedContents) {
            const content = state.orderedContents.at(index);
            if (content && !content.html) {
              if (config.baseUrl) {
                downloadHtml(`${config.baseUrl}/${content.file}`)
                  .then((html) => {
                    content.html = html;
                    state.pendingContents.delete(content.order);
                    resolve(1);
                  })
                  .catch(reject);
                return;
              }
            }
          }
          resolve(0);
        } catch (ex) {
          reject(ex as Error);
        }
      });
    }),
  )
    .then(() => {
      if (state.pendingContents.size) {
        timeout = setTimeout(preloadContents, 100);
      }
    })
    .catch(genericCatch('Exception while preloading contents'));
};

export default preloadContents;
