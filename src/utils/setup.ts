import { config, type Config } from '@/types/config';

const setup = (initialConfig: Config) => {
  const res = config.safeParse(initialConfig);

  if (!res.success) {
    throw new Error(
      `Invalid config with following error(s):\n${res.error.errors.join('\n')}`,
    );
  }

  return res.data;
};

export default setup;
