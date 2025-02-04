import genericCatch from '@/tools/genericCatch';
import requestIdleCallback from '@/utils/requestIdleCallback';
import { getState } from '@/utils/state';

const preloadFonts = (fontFamily?: string, callback?: () => void) => {
  const state = getState();
  if (state.layout !== 'flow') {
    return;
  }

  let font = fontFamily;
  if (!font) {
    const entries = Array.from(state.fontsUrls.entries());
    for (let i = 0, l = entries.length; i < l && !font; i++) {
      const entry = entries[i];
      if (entry) {
        const [theFont, urls] = entry;
        if (urls.length) {
          font = theFont;
        }
      }
    }
  }

  if (!font) {
    return;
  }

  const fontsUrls = state.fontsUrls.get(font);
  if (!fontsUrls) {
    return;
  }

  if (!fontsUrls.length) {
    if (callback) {
      callback();
    }
    return;
  }

  console.log(`Preloading ${fontsUrls.length} fonts for ${font}`);

  requestIdleCallback(() => {
    Promise.all(
      fontsUrls.map(
        (fontUrl) =>
          new Promise((resolve) => {
            const link = state.doc.createElement('link');
            link.onload = resolve;
            link.onerror = resolve;
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'font';
            link.crossOrigin = 'anonymous';
            requestIdleCallback(() => {
              state.doc.head.appendChild(link);
            });
          }),
      ),
    )
      .then(() => {
        state.fontsUrls.set(font, []);
        if (callback) {
          callback();
        } else {
          requestIdleCallback(() => {
            preloadFonts();
          });
        }
      })
      .catch(genericCatch('Exception while preloading fonts'));
  });
};

export default preloadFonts;
