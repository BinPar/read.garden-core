import waitForRender from '@/utils/waitForRender';

const requestIdleCallback = (callback: () => void) => {
  if (window.requestIdleCallback) {
    return window.requestIdleCallback(callback);
  }
  waitForRender(callback);
};

export default requestIdleCallback;
