import { getConfig } from '@/utils/config';

const getDomainForImages = () => {
  const config = getConfig();
  if (!config.baseUrl) return '';
  const { protocol, host } = new URL(config.baseUrl);
  const domain = `${protocol}//${host}${config.customRouteForImages ?? ''}`;
  return domain;
};

export default getDomainForImages;
