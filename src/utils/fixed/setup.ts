import setCssVariable from '@/tools/setCssVariable';
import { checkCenter, setScale } from '@/utils/fixed/setupEvents';
import { getState, updateState } from '@/utils/state';
import { addPropertyChangeListener } from '@/utils/state/propertyChangeListener';

export const fixedSetup = () => {
  console.log('fixed setup');
  checkCenter();
  window.requestAnimationFrame(() => {
    setCssVariable('viewer-margin-top', '0');
  });
};

const setup = (state = getState()) => {
  console.log('fixed init', state);
  updateState({ initialized: true });

  addPropertyChangeListener<'zoom'>('zoom', ({ newValue }) => {
    setScale(newValue / 100);
  });

  if (!state.loadingStyles) {
    fixedSetup();
  }
};

export default setup;
