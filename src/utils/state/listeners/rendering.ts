import { type DrawHighlights } from '@/@types/actions';
import dispatch from '@/utils/dispatch';
import { getState, updateState } from '@/utils/state';
import type { StatePropChangeHandler } from '@/utils/state/getPropertyValueListener';

const renderingListener: StatePropChangeHandler<'rendering'> = {
  property: 'rendering',
  value: false,
  handler: () => {
    const state = getState();
    console.log('pendingDrawActions', state.pendingDrawActions);
    for (let i = 0, l = state.pendingDrawActions.length; i < l; i++) {
      const action = state.pendingDrawActions[i];
      if (action) {
        dispatch(action);
      }
    }
    updateState({ pendingDrawActions: new Array<DrawHighlights>() }, true);
  },
};

export default renderingListener;
