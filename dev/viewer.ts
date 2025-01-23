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
                initialContentSlug: '8',
                direction: 'horizontal',
                baseUrl,
                jsonData: data,
                fontFamily: 'Obf-Helvetica',
                selectionMenuOptions: [
                  {
                    color: '#ff0000',
                    key: 'red',
                    title: 'Red',
                    className: 'highlighter',
                    style: '--highlighter-color: #ff0000',
                  },
                  {
                    color: '#ff00ff',
                    key: 'pink',
                    title: 'Pink',
                    className: 'highlighter',
                    style: '--highlighter-color: #ff00ff',
                  },
                  {
                    color: '#00ff00',
                    key: 'green',
                    title: 'Green',
                    className: 'highlighter',
                    style: '--highlighter-color: #00ff00',
                  },
                  {
                    color: '#0000ff',
                    key: 'notes',
                    title: 'Notes',
                    className: 'note',
                    style: '--highlighter-color: #0000ff',
                  },
                ],
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

          if (data.type === 'fixed') {
            window.rgCore = window.readGardenCore({
              layout: data.type,
              options: {
                initialContentSlug: '3',
                direction: 'horizontal',
                paginated: true,
                baseUrl,
                jsonData: data,
                minimumZoomValue: 0.25,
                maximumZoomValue: 4,
                padding: {
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                },
                selectionMenuOptions: [
                  {
                    color: '#ff0000',
                    key: 'red',
                    title: 'Red',
                    className: 'highlighter',
                    style: '--highlighter-color: #ff0000',
                  },
                  {
                    color: '#ff00ff',
                    key: 'pink',
                    title: 'Pink',
                    className: 'highlighter',
                    style: '--highlighter-color: #ff00ff',
                  },
                  {
                    color: '#00ff00',
                    key: 'green',
                    title: 'Green',
                    className: 'highlighter',
                    style: '--highlighter-color: #00ff00',
                  },
                  {
                    color: '#0000ff',
                    key: 'notes',
                    title: 'Notes',
                    className: 'note',
                    style: '--highlighter-color: #0000ff',
                  },
                ],
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
    img.addEventListener('error', () => {
      console.error(`Error loading ${img.src}`);
    });
    img.src = `${ngrokUrl && !window.location.host.includes('localhost') ? ngrokUrl : 'http://localhost:3001'}/set-cookies?key=${key}&v=${Date.now()}`;
  }
};
