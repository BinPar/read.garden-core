import { env } from '../env';

const getSignerUrl = (): string | undefined => {
  if (env.CLOUDFRONT_URL && env.PROJECT_SLUG) {
    return `${env.CLOUDFRONT_URL}/signer/${env.PROJECT_SLUG}`;
  }
  return undefined;
};

export default getSignerUrl;
