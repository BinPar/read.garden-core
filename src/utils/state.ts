import type { Options } from '@/@types/config';
import type { CommonState, FullState, State } from '@/@types/state';
import type { StatePropChangeHandler } from '@/utils/state/getPropertyValueListener';
import type { DrawHighlights } from '@/@types/actions';

import listeners from '@/utils/state/listeners';
import processJsonData from '@/utils/processJsonData';
import { notifyPropertyChange } from '@/utils/state/propertyChangeListener';
import type setupDomElements from '@/utils/setupDomElements';
import { defaultFixedConfig, defaultState } from '@/utils/defaults';
import { getConfig } from '@/utils/config';
import setupFlowElements from '@/utils/flow/setupElements';
import type { CoreHighlight, UserHighlight } from '@/@types/selection';

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
  initialState: ReturnType<typeof setupDomElements>,
) => {
  const { layout } = initialOptions;
  const { container } = initialState;

  const containerRect = container.getBoundingClientRect();
  const containerWidth = Math.floor(containerRect.width);
  const containerHeight = Math.floor(containerRect.height);

  const readMode = initialOptions.options.readMode ?? defaultState.readMode;
  const theme = initialOptions.options.theme ?? defaultState.theme;

  let common: CommonState = {
    ...defaultState,
    ...initialState,
    theme,
    readMode,
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    initialized: false,
    coreCssLoaded: false,
    contentCssLoaded: false,
    loadingStyles: true,
    rendering: false,
    layout,
    containerWidth,
    containerHeight,
    contentSlug: '',
    contentOrder: -1,
    pendingContents: new Set<number>(),
    loadingContents: new Set<number>(),
    currentSelection: null,
    currentHighlight: null,
    domHighlightsById: new Map<string | number, HTMLDivElement[]>(),
    coreHighlightsByKey: new Map<string, CoreHighlight>(),
    userHighlightsById: new Map<string | number, UserHighlight>(),
    pendingDrawActions: new Array<DrawHighlights>(),
  };

  if (initialOptions.jsonData) {
    common = {
      ...common,
      ...processJsonData(initialOptions.jsonData),
    };
  }

  if (layout === 'fixed') {
    state = {
      ...common,
      layout: 'fixed',
      zoom: initialOptions.options.zoom ?? defaultFixedConfig.zoom,
      fitMode: initialOptions.options.fitMode ?? defaultFixedConfig.fitMode,
    };
  }

  if (layout === 'flow') {
    const config = getConfig();
    if (config.layout !== 'flow') {
      throw new Error('Not flow config in flow layout');
    }

    const flowElements = setupFlowElements(initialState);

    state = {
      ...common,
      ...flowElements,
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
