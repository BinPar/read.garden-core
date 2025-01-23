import { fixedSetup } from '@/utils/fixed/setup';
import { flowSetup } from '@/utils/flow/setup';
import { getState } from '@/utils/state';
import getPropertyValueListener, {
  type StatePropChangeHandler,
} from '@/utils/state/getPropertyValueListener';

const { resolver, waiter } = getPropertyValueListener();

export const onCssLoaded = waiter;

const cssLoaderListener: StatePropChangeHandler<'loadingStyles'> = {
  property: 'loadingStyles',
  value: false,
  handler: () => {
    console.log('loadingStyles handler');
    resolver();
    const state = getState();
    if (state.layout === 'flow') {
      flowSetup();
    }
    if (state.layout === 'fixed') {
      fixedSetup();
    }
  },
};

export default cssLoaderListener;
