import setCssVariable from '@/tools/setCssVariable';
import setFitMode from '@/utils/fixed/setFitMode';
import { checkCenter, setScale } from '@/utils/fixed/setupEvents';
import { getState, updateState } from '@/utils/state';
import { addPropertyChangeListener } from '@/utils/state/propertyChangeListener';

export const fixedSetup = () => {
  window.requestAnimationFrame(() => {
    const state = getState();

    if (state.layout !== 'fixed') {
      return;
    }

    if (state.fitMode) {
      setFitMode(state.fitMode);
    } else if (state.zoom) {
      setScale(state.zoom / 100);
    }

    checkCenter();
    window.requestAnimationFrame(() => {
      setCssVariable('viewer-margin-top', '0');
      updateState({ rendering: false });
    });
  });
};

const setup = () => {
  const state = getState();

  if (state.layout !== 'fixed') {
    return;
  }

  console.log('fixed setup', state.initialized);

  if (state.initialized) {
    console.log('hey');
    fixedSetup();
    return;
  }

  updateState({ initialized: true });

  addPropertyChangeListener<'zoom'>('zoom', ({ newValue }) => {
    setScale(newValue / 100);
  });

  if (!state.loadingStyles) {
    fixedSetup();
  }
};

export default setup;
