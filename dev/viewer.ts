import genericCatch from '@/tools/genericCatch';
import type { JsonData } from '@/@types/rg';
import type { SelectionOption } from '@/@types/selection';
import type { Button } from '@/@types/buttons';
import type { EventHandler } from '@/@types/events';

const selectionOptions: SelectionOption[] = [
  {
    color: '#ff0000',
    type: 'highlight',
    key: 'red',
    title: 'Red',
    className: 'highlighter',
    style: '--highlighter-color: #ff0000',
  },
  {
    color: '#ff00ff',
    type: 'highlight',
    key: 'pink',
    title: 'Pink',
    className: 'highlighter',
    style: '--highlighter-color: #ff00ff',
  },
  {
    color: '#00ff00',
    type: 'highlight',
    key: 'green',
    title: 'Green',
    className: 'highlighter',
    style: '--highlighter-color: #00ff00',
  },
  {
    color: '#0000ff',
    type: 'note',
    key: 'notes',
    title: 'Notes',
    className: 'note',
    style: '--highlighter-color: #0000ff',
  },
];

const flowButtons: (Button | Button<'fontFamily'>)[] = [
  {
    type: 'increaseFont',
    text: 'A+',
  },
  {
    type: 'decreaseFont',
    text: 'A-',
  },
  {
    type: 'setFontFamily',
    text: 'Roboto',
    prop: 'fontFamily',
    value: 'Obf-RobotoSlab',
  },
  {
    type: 'setFontFamily',
    text: 'Helvetica',
    prop: 'fontFamily',
    value: 'Obf-Helvetica',
  },
];

const fixedButtons: (Button | Button<'fontFamily'>)[] = [
  {
    type: 'zoomIn',
    text: '+',
  },
  {
    type: 'zoomOut',
    text: '-',
  },
];

const eventHandler: EventHandler = (event) => {
  console.log('Core event dispatched!', event);
};

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
              slug: data.slug,
              cssHref: '/css/styles.css',
              baseUrl,
              jsonData: data,
              eventHandler,
              options: {
                direction: 'horizontal',
                initialContentSlug: '14',
                touch: true,
                fontFamily: 'Obf-Helvetica',
                selectionMenuOptions: selectionOptions,
              },
              ui: {
                buttons: flowButtons,
              },
            });
          }

          if (data.type === 'fixed') {
            window.rgCore = window.readGardenCore({
              layout: data.type,
              slug: data.slug,
              cssHref: '/css/styles.css',
              baseUrl,
              jsonData: data,
              eventHandler,
              options: {
                direction: 'horizontal',
                initialContentSlug: '26',
                paginated: true,
                touch: true,
                minimumZoomValue: 0.25,
                maximumZoomValue: 4,
                padding: {
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                },
                zoom: 50,
                selectionMenuOptions: selectionOptions,
              },
              ui: {
                buttons: fixedButtons,
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
