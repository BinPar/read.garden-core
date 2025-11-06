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
    // validamos el ancho de state.content.firstElementChild para
    // confirmar que se inserto el contenido del libro
    if (
      state.layout === 'fixed' &&
      (state.content.firstElementChild?.clientWidth || 0) > 0
    ) {
      fixedSetup();
    }
  },
};

export default cssLoaderListener;
