import genericCatch from '@/tools/genericCatch';
import type { JsonData } from '@/@types/rg';
import type { SelectionOption, SelectionRange } from '@/@types/selection';
import type { Button } from '@/@types/buttons';
import type { EventHandler } from '@/@types/events';
import getId from '@/tools/getId';
import nonNullable from '@/tools/nonNullable';

const selectionOptions: SelectionOption[] = [
  {
    color: '#ff0000',
    type: 'highlighter',
    key: 1,
    title: 'Red',
  },
  {
    color: '#ff00ff',
    type: 'highlighter',
    key: 2,
    title: 'Pink',
  },
  {
    color: '#00ff00',
    type: 'highlighter',
    key: 3,
    title: 'Green',
  },
  {
    color: 'rgb(82, 82, 200)',
    type: 'note',
    key: 4,
    title: 'Red',
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
  {
    type: 'togglePageLayout',
    text: 'Double page',
  },
  {
    type: 'toggleAnimationsEnabled',
    text: 'Animations',
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
    value: 'Obf-RobotoSlab',
  },
  {
    type: 'setFontFamily',
    text: 'Helvetica',
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

interface StoredHighlight {
  id: string;
  highlighter: string | number;
  range: SelectionRange;
  note?: string;
}

const getStoredHighlights = (key: string) => {
  const highlights = window.localStorage.getItem(key);
  return highlights ? (JSON.parse(highlights) as StoredHighlight[]) : [];
};

const eventHandler: EventHandler = (event) => {
  console.debug('Core event dispatched!', event);

  if (event.type === 'onUserSelect') {
    window.rgCore.dispatch({
      type: 'showSelectionMenu',
      options: selectionOptions,
    });
  }

  if (event.type === 'onHighlightClick') {
    const storedHighlights = getStoredHighlights(
      `rg_dev_highlights_${event.slug}`,
    );
    const highlight = storedHighlights.find((hl) => hl.id === event.id);
    if (highlight) {
      window.rgCore.dispatch({
        type: 'showSelectionMenu',
        id: highlight.id,
        options: selectionOptions.map((option) => ({
          ...option,
          selected: option.key === highlight.highlighter,
        })),
        deleteOption: true,
      });
    }
  }

  if (event.type === 'onHighlightEdit') {
    const storeKey = `rg_dev_highlights_${event.slug}`;
    const storedHighlights = getStoredHighlights(storeKey);
    window.localStorage.setItem(
      storeKey,
      JSON.stringify(
        storedHighlights.map((hl) => {
          if (hl.id === event.id) {
            return {
              ...hl,
              highlighter: event.highlighter,
            };
          }
          return hl;
        }),
      ),
    );
  }

  if (event.type === 'onHighlightRemove') {
    const storeKey = `rg_dev_highlights_${event.slug}`;
    const storedHighlights = getStoredHighlights(storeKey);
    window.localStorage.setItem(
      storeKey,
      JSON.stringify(storedHighlights.filter((hl) => hl.id !== event.id)),
    );
  }

  if (event.type === 'onNewHighlight') {
    const failed = false && Math.random() > 0.8; // For testing purposes
    if (failed) {
      window.rgCore.dispatch({
        type: 'cancelHighlight',
        key: event.key,
      });
    } else {
      const storeKey = `rg_dev_highlights_${event.slug}`;
      const storedHighlights = getStoredHighlights(storeKey);
      const id = getId();
      storedHighlights.push({
        id,
        highlighter: event.highlighter,
        range: event.range,
        note: event.note,
      });
      window.localStorage.setItem(storeKey, JSON.stringify(storedHighlights));
      window.rgCore.dispatch({
        type: 'confirmHighlight',
        id,
        key: event.key,
      });
    }
  }
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
                uiModeTop: -40,
                direction: 'horizontal',
                initialContentSlug: '15',
                touch: true,
                fontFamily: 'Obf-Helvetica',
                selectionMenuOptions: selectionOptions,
                pageLabelsTransformY: -20,
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

          const highlights = getStoredHighlights(
            `rg_dev_highlights_${data.slug}`,
          );
          if (highlights.length) {
            window.rgCore.dispatch({
              type: 'drawHighlights',
              highlights: highlights
                .map((highlight) => {
                  const highlighter = selectionOptions.find(
                    (hl) => hl.key === highlight.highlighter,
                  );
                  if (!highlighter) {
                    return null;
                  }
                  return {
                    ...highlight,
                    id: highlight.id,
                    color: highlighter.color,
                    type: highlighter.type,
                    highlighter: highlighter.key,
                    range: highlight.range,
                    note: highlight.note,
                  };
                })
                .filter(nonNullable),
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
