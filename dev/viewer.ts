import genericCatch from '@/tools/genericCatch';
import type { JsonData } from '@/@types/rg';

import { dispatch } from '../build';

window.onload = () => {
  const iframe = document.createElement('iframe');
  iframe.id = 'rg-iframe';
  iframe.srcdoc = `<html><head><link rel="stylesheet" type="text/css" href="/css/rg-core.css" /></head><body></body></html>`;
  document.body.appendChild(iframe);
  const url = new URL(document.location.toString());
  const key = url.searchParams.get('key');
  const cloudFrontUrl = window.sessionStorage.getItem('rg_dev_cloudFrontUrl');
  console.log({ key, cloudFrontUrl });
  if (key && cloudFrontUrl) {
    const img = document.createElement('img');
    img.fetchPriority = 'high';
    const indexJson = `${cloudFrontUrl}/${key}/index.json`;
    img.addEventListener('load', () => {
      fetch(indexJson)
        .then((response) => response.json())
        .then((json) => {
          const data = json as JsonData;
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'init', data });
          }
        })
        .catch(genericCatch(`Error fetching ${indexJson}`));
    });
    img.src = `http://localhost:3001/set-cookies?key=${key}`;
  }
};
