import type { Action, DispatchHandler } from '@/@types/actions';

import actions from '@/utils/actions';
import { getConfig } from '@/utils/config';
import { getState } from '@/utils/state';

const dispatch = (action: Action) => {
  const handler = actions[action.type] as DispatchHandler<typeof action.type>;
  if (!handler) {
    throw new Error(`No handler for action type: ${action.type}`);
  }
  handler({ action, state: getState(), config: getConfig() });
};

export default dispatch;
