import type { Options } from '@/@types/config';
import type { CommonState, State } from '@/@types/state';
import processJsonData from '@/utils/processJsonData';

let state: State | undefined;

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
    layout,
    containerWidth,
    containerHeight,
    slug: '',
    productSlug: '',
    contentSlug: '',
  };

  if (initialOptions.options.jsonData) {
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
    
    const pagesLabelsContainer = initialState.doc.createElement('div');
    pagesLabelsContainer.id = 'page-labels-container';
    initialState.wrapper.appendChild(pagesLabelsContainer);

    state = {
      ...common,
      layout: 'flow',
      snaps: new Set<number>(),
      snapsContainer,
      pageLabelsContainer: pagesLabelsContainer,
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

export const updateState = (newState: Partial<State>) => {
  if (!state) {
    throw new Error('State is not initialized');
  }
  const keys = Array.from(Object.keys(newState));
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    if (key) {
      const stateKey = key as keyof State;
      const newValue = newState[stateKey];
      if (newValue !== state[stateKey]) {
        (state as Record<keyof State, unknown>)[stateKey] = newValue;
      }
    }
  }
};
