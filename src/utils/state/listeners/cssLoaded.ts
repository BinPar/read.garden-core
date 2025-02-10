import fixedSetup from '@/utils/fixed/setup';
import flowSetup from '@/utils/flow/setup';
import { getState } from '@/utils/state';
import { type StatePropChangeHandler } from '@/utils/state/getPropertyValueListener';

const cssLoaderListener: StatePropChangeHandler<'loadingStyles'> = {
  property: 'loadingStyles',
  value: false,
  handler: () => {
    const state = getState();
    if (state.layout === 'flow') {
      flowSetup(true);
    }
    if (state.layout === 'fixed') {
      fixedSetup();
    }
  },
};

export default cssLoaderListener;
