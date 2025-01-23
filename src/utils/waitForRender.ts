const waitForRender = (callback: FrameRequestCallback, timeout = 1) => {
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      window.requestAnimationFrame(callback);
    }, timeout);
  });
};

export default waitForRender;
