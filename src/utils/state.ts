import type { Options } from '@/@types/config';
import type { CommonState, FullState, State } from '@/@types/state';
import type { StatePropChangeHandler } from '@/utils/state/getPropertyValueListener';

import listeners from '@/utils/state/listeners';
import processJsonData from '@/utils/processJsonData';
import { notifyPropertyChange } from '@/utils/state/propertyChangeListener';
import type setupDomElements from '@/utils/setupDomElements';
import { defaultFixedConfig } from '@/utils/defaults';
import { getConfig } from '@/utils/config';

let state: State | undefined;

const listenersMap = new Map<
  keyof FullState,
  Map<unknown, StatePropChangeHandler<keyof FullState>['handler']>
>();

for (let i = 0, l = listeners.length; i < l; i++) {
  const listener = listeners[i];
  if (listener) {
    let propertyMap = listenersMap.get(listener.property);
    if (!propertyMap) {
      propertyMap = new Map();
      listenersMap.set(listener.property, propertyMap);
    }
    if (!propertyMap.has(listener.value)) {
      propertyMap.set(listener.value, listener.handler);
    } else {
      throw new Error(
        `Listener for property "${listener.property}" with value "${listener.value?.toString()}" already exists`,
      );
    }
  }
}

export const init = (
  initialOptions: Options,
  initialState: ReturnType<typeof setupDomElements> & Pick<State, 'readMode'>,
) => {
  const { layout } = initialOptions;
  const { container } = initialState;

  const containerRect = container.getBoundingClientRect();
  const containerWidth = Math.floor(containerRect.width);
  const containerHeight = Math.floor(containerRect.height);

  let common: CommonState = {
    ...initialState,
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    initialized: false,
    coreCssLoaded: false,
    contentCssLoaded: false,
    loadingStyles: true,
    layout,
    containerWidth,
    containerHeight,
    slug: '',
    productSlug: '',
    contentSlug: '',
    contentOrder: -1,
    pendingContents: new Set<number>(),
    selectedText: '',
    selectionRanges: null,
    highlightsLayers: new Map<number, HTMLDivElement>(),
  };

  if (initialOptions.options.jsonData) {
    if (
      initialOptions.options.jsonData.cssURL &&
      initialOptions.options.baseUrl
    ) {
      const link = initialState.doc.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = `${initialOptions.options.baseUrl}/${initialOptions.options.jsonData.cssURL}`;
      const onFinish = () => {
        updateState((current) => {
          if (
            current.coreCssLoaded &&
            (current.layout === 'fixed' || current.fontsCssLoaded)
          ) {
            return { contentCssLoaded: true, loadingStyles: false };
          }
          return { contentCssLoaded: true };
        });
      };
      link.onload = () => {
        console.log('content styles loaded');
        onFinish();
      };
      link.onerror = (ex) => {
        console.error('Error loading content styles', ex);
        onFinish();
      };
      initialState.doc.head.appendChild(link);
    }

    common = {
      ...common,
      ...processJsonData(initialOptions.options.jsonData),
    };
  }

  if (layout === 'fixed') {
    state = {
      ...common,
      layout: 'fixed',
      zoom: initialOptions.options.zoom ?? defaultFixedConfig.zoom,
    };
  }

  if (layout === 'flow') {
    const config = getConfig();
    if (config.layout !== 'flow') {
      throw new Error('Not flow config in flow layout');
    }

    const chapterStart = initialState.doc.createElement('div');
    chapterStart.id = 'chapter-start';
    initialState.content.insertAdjacentElement('beforebegin', chapterStart);

    const chapterEnd = initialState.doc.createElement('div');
    chapterEnd.id = 'chapter-end';
    initialState.content.insertAdjacentElement('afterend', chapterEnd);

    const snapsContainer = initialState.doc.createElement('div');
    snapsContainer.id = 'snaps-container';
    initialState.wrapper.appendChild(snapsContainer);

    state = {
      ...common,
      layout: 'flow',
      fontSize: config.fontSize,
      fontFamily: config.fontFamily,
      lineHeight: config.lineHeight,
      textAlign: config.textAlign,
      previousContent: initialOptions.options.initialContentSlug ?? null,
      fontsCssLoaded: false,
      snaps: new Set<number>(),
      snapByContent: new Map<string, number>(),
      contentBySnap: new Map<number, string>(),
      fontsUrls: new Map<string, string[]>(),
      firstSnap: 0,
      lastSnap: 0,
      chapterStart,
      chapterEnd,
      snapsContainer,
      columnWidth: 0,
      columnGap: 0,
      columnCount: 0,
      goToEnd: false,
    };
  }
};

export const getState = () => {
  if (!state) {
    throw new Error('State is not initialized');
  }
  return state;
};

export const update = (newState: Partial<State>, avoidListeners = false) => {
  if (!state) {
    throw new Error('State is not initialized');
  }
  const keys = Array.from(Object.keys(newState));
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    if (key) {
      const stateKey = key as keyof State;
      const oldValue = state[stateKey];
      const newValue = newState[stateKey];
      if (newValue !== oldValue) {
        (state as Record<keyof State, unknown>)[stateKey] = newValue;
        if (!avoidListeners) {
          const listener = listenersMap.get(stateKey);
          if (listener) {
            const listenerHandler = listener.get(newValue);
            if (listenerHandler) {
              console.log(
                `Calling listener for ${stateKey} and value ${newValue?.toString()}`,
              );
              listenerHandler();
            }
          }
          notifyPropertyChange(stateKey, oldValue, newValue);
        }
      }
    }
  }
};

export const updateState = (
  newState: Partial<State> | ((current: FullState) => Partial<State>),
  avoidListeners = false,
) => {
  if (!state) {
    throw new Error('State is not initialized');
  }
  if (typeof newState === 'function') {
    update(newState(state as FullState), avoidListeners);
  } else {
    update(newState, avoidListeners);
  }
};
