import { createClient } from 'redis';

import genericCatch from '@/tools/genericCatch';

import { env } from 'server/env';

type Client = ReturnType<typeof createClient>;

let client: Client | undefined;

const pendingResolvers = new Set<(data: Client) => void>();

let creating = false;

const getClient = async () => {
  if (creating) {
    const promise = new Promise<Client>((resolve) => {
      pendingResolvers.add(resolve);
    });
    return promise;
  }

  if (!client) {
    creating = true;

    client = createClient({
      url: env.REDIS_URL,
    });

    client.on('error', (err) => {
      console.error(
        `Error on redis client: ${
          (err as Error).message || (err as Error).stack || err
        }`,
      );
      creating = false;
      if (pendingResolvers.size) {
        pendingResolvers.forEach((resolver) => {
          resolver(client!);
        });
        pendingResolvers.clear();
      }
    });

    const promise = new Promise<Client>((resolve) => {
      pendingResolvers.add(resolve);
      client!
        .connect()
        .then(() => {
          creating = false;
          if (pendingResolvers.size) {
            pendingResolvers.forEach((resolver) => {
              resolver(client!);
            });
            pendingResolvers.clear();
          }
        })
        .catch((ex) => {
          genericCatch('Exception at redis connect')(ex);
          creating = false;
          if (pendingResolvers.size) {
            pendingResolvers.forEach((resolver) => {
              resolver(client!);
            });
            pendingResolvers.clear();
          }
        });
    });

    await promise;
  }

  return client;
};

export default getClient;
