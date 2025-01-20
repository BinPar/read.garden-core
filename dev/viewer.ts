import genericCatch from '@/tools/genericCatch';
import type { JsonData } from '@/@types/rg';

window.onload = () => {
  const url = new URL(document.location.toString());
  const key = url.searchParams.get('key');
  const cloudFrontUrl = window.sessionStorage.getItem('rg_dev_cloudFrontUrl');
  if (key && cloudFrontUrl) {
    const ngrokUrl = window.sessionStorage.getItem('rg_dev_ngrokUrl');
    const img = document.createElement('img');
    img.fetchPriority = 'high';
    const baseUrl = `${cloudFrontUrl}/${key}`;
    const indexJson = `${baseUrl}/index.json`;
    img.addEventListener('load', () => {
      fetch(indexJson)
        .then((response) => response.json())
        .then((json) => {
          const data = json as JsonData;
          if (data.type === 'flow') {
            window.rgCore = window.readGardenCore({
              layout: data.type,
              options: {
                initialContentSlug: '3',
                direction: 'horizontal',
                baseUrl,
                jsonData: data,
                fontFamily: 'Obf-Helvetica',
              },
              ui: {
                buttons: [
                  {
                    type: 'backward',
                    text: '<',
                  },
                  {
                    type: 'forward',
                    text: '>',
                  },
                  {
                    type: 'switchMode',
                    text: 'UI',
                  },
                ],
              },
            });
          }
        })
        .catch(genericCatch(`Error fetching ${indexJson}`));
    });
    img.src = `${ngrokUrl && !window.location.host.includes('localhost') ? ngrokUrl : 'http://localhost:3001'}/set-cookies?key=${key}`;
  }
};
