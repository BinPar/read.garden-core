function preloadWorker() {
  self.onmessage = function (ev: MessageEvent<string>) {
    self.postMessage(`Got message: ${ev.data}`);
  };
}

export default preloadWorker;

