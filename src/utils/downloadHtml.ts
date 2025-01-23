import replaceUrls from '@/utils/replaceUrls';

const downloadHtml = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  const html = await response.text();
  const processedHtml = replaceUrls(html);
  new Promise<void>((resolve) => {
    try {
      const images = Array.from(
        processedHtml.matchAll(/<img[^>]+src="([^">]+)"/g),
      );
      if (images.length) {
        for (let i = 0, l = images.length; i < l; i++) {
          const image = images[i];
          if (image) {
            const src = image[1];
            if (src) {
              const img = new Image();
              img.src = src;
            }
          }
        }
      }
    } catch {}
    resolve();
  }).catch(console.error);
  return processedHtml;
};

export default downloadHtml;
