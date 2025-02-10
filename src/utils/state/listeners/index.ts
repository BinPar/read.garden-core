import type { FullState } from '@/@types/state';
import type { StatePropChangeHandler } from '@/utils/state/getPropertyValueListener';

import cssLoaderListener from '@/utils/state/listeners/cssLoaded';
import renderingListener from '@/utils/state/listeners/rendering';

const listeners: StatePropChangeHandler<keyof FullState>[] = [
  cssLoaderListener,
  renderingListener,
];

export default listeners;
