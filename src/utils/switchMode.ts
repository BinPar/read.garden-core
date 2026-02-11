import { getState, updateState } from '@/utils/state';

const switchMode = () => {
  const state = getState();

  state.container.classList.toggle('ui-mode');
  updateState((current) => ({
    readMode: !current.readMode,
  }));
};

export default switchMode;
