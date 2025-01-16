import type { FullState } from '@/@types/state';

export interface StatePropChangeHandler<K extends keyof FullState> {
  property: K;
  value: FullState[K];
  handler: () => void;
}

type CurrentPromiseEnder = (() => void) | null;

const getPropertyValueListener = () => {
  let currentResolve: CurrentPromiseEnder = null;
  let currentReject: CurrentPromiseEnder = null;

  return {
    resolver: (): void => {
      if (currentResolve) {
        currentResolve();
      }
      currentReject = null;
      currentResolve = null;
    },
    waiter: async (): Promise<void> => {
      if (currentReject) {
        currentReject();
      }
      return new Promise<void>((resolve, reject) => {
        currentResolve = resolve;
        currentReject = reject;
      });
    },
  };
};

export default getPropertyValueListener;
