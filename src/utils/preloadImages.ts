import { getState } from '@/utils/state';

const preloadImages = (images?: string[]) => {
  if (images?.length) {
    const state = getState();
    for (let i = 0, l = images.length; i < l; i++) {
      const src = images[i];
      if (src) {
        const image = new Image();
        image.src = src;
        state.preload.appendChild(image);
      }
    }
  }
};

export default preloadImages;
