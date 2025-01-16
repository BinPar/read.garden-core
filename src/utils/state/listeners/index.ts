import type { FullState } from '@/@types/state';
import type { StatePropChangeHandler } from '@/utils/state/getPropertyValueListener';

import cssLoaderListener from '@/utils/state/listeners/cssLoaded';

const listeners: StatePropChangeHandler<keyof FullState>[] = [
  cssLoaderListener,
];

export default listeners;
