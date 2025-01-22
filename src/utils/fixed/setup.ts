import { getState } from '@/utils/state';

export const fixedSetup = () => {
  console.log('fixed setup');
};

const setup = (state = getState()) => {
  console.log('fixed init', state);
};

export default setup;
