function download() {
  const nonNullable = <T>(value: T): value is NonNullable<T> => value != null;

  self.onmessage = function (
    ev: MessageEvent<{
      url: string;
      replacements?: [string, string][];
    }>,
  ) {
    const { url, replacements } = ev.data;
    fetch(url, {
      credentials: 'include',
    })
      .then((response) => response.text())
      .then((res) => {
        let html = res;
        if (replacements?.length) {
          for (let i = 0, l = replacements.length; i < l; i++) {
            const replacement = replacements[i];
            if (replacement) {
              const [replaceThis, forThis] = replacement;
              html = html.split(replaceThis).join(forThis);
            }
          }
        }
        const images = Array.from(html.matchAll(/<img[^>]+src="([^">]+)"/g))
          .map((img) => img[1])
          .filter(nonNullable);
        self.postMessage({ html, images });
      })
      .catch((ex) => {
        throw ex;
      });
  };
}

let worker: Worker | undefined = undefined;

export interface DownloadWorkerResponse {
  html: string;
  images: string[];
}

export const getWorker = () => {
  if (!worker) {
    worker = new Worker(
      URL.createObjectURL(
        new Blob(['(' + download.toString() + ')()'], {
          type: 'text/javascript',
        }),
      ),
    );
  }
  return worker;
};

export default download;
