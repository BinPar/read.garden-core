import { getState } from '@/utils/state';

export const fixedSetup = () => {
  console.log('fixed setup');
};

const setup = (state = getState()) => {
  const meta = state.doc.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'user-scalable=1';

  state.doc.head.appendChild(meta);
};

export default setup;
