import genericCatch from '@/tools/genericCatch';
import type { JsonData } from '@/@types/rg';
import type { SelectionOption } from '@/@types/selection';
import type { Button } from '@/@types/buttons';
import type { EventHandler } from '@/@types/events';

const selectionOptions: SelectionOption[] = [
  {
    color: '#ff0000',
    type: 'highlighter',
    key: 'red',
    title: 'Red',
    style: '--highlighter-color: #ff0000',
    selected: true,
  },
  {
    color: '#ff00ff',
    type: 'highlighter',
    key: 'pink',
    title: 'Pink',
    style: '--highlighter-color: #ff00ff',
  },
  {
    color: '#00ff00',
    type: 'highlighter',
    key: 'green',
    title: 'Green',
    style: '--highlighter-color: #00ff00',
  },
  {
    color: '#ff0000',
    type: 'highlighter',
    key: 'red',
    title: 'Red',
    style: '--highlighter-color: #ff0000',
    selected: true,
  },
  {
    color: '#ff00ff',
    type: 'highlighter',
    key: 'pink',
    title: 'Pink',
    style: '--highlighter-color: #ff00ff',
  },
  {
    color: '#00ff00',
    type: 'highlighter',
    key: 'green',
    title: 'Green',
    style: '--highlighter-color: #00ff00',
  },
  {
    color: '#00ff00',
    type: 'highlighter',
    key: 'green',
    title: 'Green',
    style: '--highlighter-color: #00ff00',
  },
  {
    color: '#ff00ff',
    type: 'highlighter',
    key: 'pink',
    title: 'Pink',
    style: '--highlighter-color: #ff00ff',
  },
  {
    color: '#00ff00',
    type: 'highlighter',
    key: 'green',
    title: 'Green',
    style: '--highlighter-color: #00ff00',
  },
  {
    color: '#00ff00',
    type: 'highlighter',
    key: 'green',
    title: 'Green',
    style: '--highlighter-color: #00ff00',
  },
  {
    color: '#0000ff',
    type: 'note',
    key: 'notes',
    title: 'Notes',
    style: '--highlighter-color: #0000ff',
  },
  {
    color: '#0000ff',
    type: 'note',
    key: 'notes',
    title: 'Notes',
    style: '--highlighter-color: #0000ff',
  },
];

const commonButtons: Button<'theme'>[] = [
  {
    type: 'setTheme',
    text: 'Light',
    prop: 'theme',
    value: 'light',
  },
  {
    type: 'setTheme',
    text: 'Dark',
    prop: 'theme',
    value: 'dark',
  },
];

const flowButtons: (
  | Button
  | Button<'fontFamily'>
  | Button<'textAlign'>
  | Button<'lineHeight'>
)[] = [
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
  // {
  //   type: 'setTextAlign',
  //   text: 'Bandera',
  //   prop: 'textAlign',
  //   value: 'start',
  // },
  // {
  //   type: 'setTextAlign',
  //   text: 'Justificado',
  //   prop: 'textAlign',
  //   value: 'justify',
  // },
  // {
  //   type: 'setTextAlign',
  //   text: 'Original',
  //   prop: 'textAlign',
  //   value: null,
  // },
  // {
  //   type: 'setLineHeight',
  //   text: 'LH -',
  //   prop: 'lineHeight',
  //   value: 1.25,
  // },
  // {
  //   type: 'setLineHeight',
  //   text: 'LH',
  //   prop: 'lineHeight',
  //   value: 1.5,
  // },
  // {
  //   type: 'setLineHeight',
  //   text: 'LH +',
  //   prop: 'lineHeight',
  //   value: 1.75,
  // },
];

const fixedButtons: (Button | Button<'fitMode'>)[] = [
  {
    type: 'zoomIn',
    text: '+',
  },
  {
    type: 'zoomOut',
    text: '-',
  },
  {
    type: 'setFitMode',
    text: 'Fit W',
    value: 'width',
  },
  {
    type: 'setFitMode',
    text: 'Fit H',
    value: 'height',
  },
  {
    type: 'setFitMode',
    text: 'Fit P',
    value: 'page',
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
                initialContentSlug: '15',
                touch: true,
                fontFamily: 'Obf-Helvetica',
                selectionMenuOptions: selectionOptions,
              },
              ui: {
                buttons: [...commonButtons, ...flowButtons],
                pageSelect: true,
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
                buttons: [...commonButtons, ...fixedButtons],
                pageSelect: true,
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
