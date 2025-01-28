import setup from '@/utils/setup';

export { default as dispatch } from '@/utils/dispatch';

if (typeof window !== 'undefined') {
  window.readGardenCore = setup;
}

export default setup;
