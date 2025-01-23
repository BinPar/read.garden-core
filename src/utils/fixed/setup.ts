import setCssVariable from '@/tools/setCssVariable';
import { checkCenter } from '@/utils/fixed/setupEvents';
import { getState, updateState } from '@/utils/state';

export const fixedSetup = () => {
  console.log('fixed setup');
  checkCenter();
  requestAnimationFrame(() => {
    setCssVariable('viewer-margin-top', '0');
  });
};

const setup = (state = getState()) => {
  console.log('fixed init', state);
  updateState({ initialized: true });

  if (!state.loadingStyles) {
    fixedSetup();
  }
};

export default setup;
