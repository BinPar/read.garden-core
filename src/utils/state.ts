import type { Options } from '@/@types/config';
import type { CommonState, FullState, State } from '@/@types/state';
import type { StatePropChangeHandler } from '@/utils/state/getPropertyValueListener';

import listeners from '@/utils/state/listeners';
import processJsonData from '@/utils/processJsonData';
import { notifyPropertyChange } from '@/utils/state/propertyChangeListener';

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
  initialState: Pick<
    State,
    'doc' | 'container' | 'viewer' | 'wrapper' | 'content' | 'readMode'
  >,
) => {
  const { layout } = initialOptions;
  const { container } = initialState;

  const containerRect = container.getBoundingClientRect();
  const containerWidth = Math.floor(containerRect.width);
  const containerHeight = Math.floor(containerRect.height);

  let common: CommonState = {
    ...initialState,
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
      link.onload = () => {
        console.log('content styles loaded');
        updateState((current) => {
          if (current.coreCssLoaded && (current.layout === 'fixed' || current.fontsCssLoaded)) {
            return { contentCssLoaded: true, loadingStyles: false };
          }
          return { contentCssLoaded: true };
        });
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
      hasHorizontalScroll: false,
      hasVerticalScroll: false,
    };
  }

  if (layout === 'flow') {
    const snapsContainer = initialState.doc.createElement('div');
    snapsContainer.id = 'snaps-container';
    initialState.wrapper.appendChild(snapsContainer);

    state = {
      ...common,
      layout: 'flow',
      fontsCssLoaded: false,
      snaps: new Set<number>(),
      snapsContainer,
      columnWidth: 0,
      columnGap: 0,
      columnCount: 0,
    };
  }
};

export const getState = () => {
  if (!state) {
    throw new Error('State is not initialized');
  }
  return state;
};

export const update = (newState: Partial<State>) => {
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
};

export const updateState = (
  newState: Partial<State> | ((current: State) => Partial<State>),
) => {
  if (!state) {
    throw new Error('State is not initialized');
  }
  if (typeof newState === 'function') {
    update(newState(state));
  } else {
    update(newState);
  }
};
