import type { Config } from '@/types/config';

let config: Config | undefined;

export const getConfig = (): Config => {
  if (!config) {
    throw new Error('Config not set');
  }

  return config;
};

export const setConfig = (newConfig: Config) => {
  config = newConfig;
};
