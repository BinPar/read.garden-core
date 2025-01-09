import { getConfig } from '@/utils/config';

const cdnRegEx = /%%CDN%%/g;

const replaceUrls = (src: string) => {
  const config = getConfig();
  if (config.baseUrl) {
    const url = new URL(config.baseUrl);
    const domain = `${url.protocol}//${url.host}`;
    src = src.replace(cdnRegEx, domain);
  }
  return src;
};

export default replaceUrls;
