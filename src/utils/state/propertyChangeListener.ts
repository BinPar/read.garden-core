import type {
  FullState,
  PropertyChangeHandler,
  StateKey,
} from '@/@types/state';

import genericCatch from '@/tools/genericCatch';

const handlers = new Map<StateKey, Set<PropertyChangeHandler<StateKey>>>();

export const addPropertyChangeListener = <K extends StateKey>(
  propertyName: K,
  handler: PropertyChangeHandler<K>,
) => {
  console.log(`Listener added for property: ${propertyName}`);
  let propertySet = handlers.get(propertyName);
  if (!propertySet) {
    propertySet = new Set<PropertyChangeHandler<StateKey>>();
    handlers.set(propertyName, propertySet);
  }
  propertySet.add(handler as PropertyChangeHandler<StateKey>);
};

export const removePropertyChangeListener = <K extends StateKey>(
  propertyName: K,
  handler: PropertyChangeHandler<K>,
) => {
  const propertySet = handlers.get(propertyName);
  if (propertySet) {
    propertySet.delete(handler as PropertyChangeHandler<StateKey>);
  }
};

export const notifyPropertyChange = <K extends StateKey>(
  propertyName: K,
  oldValue: FullState[K],
  newValue: FullState[K],
) => {
  const propertySet = handlers.get(propertyName);
  if (propertySet) {
    propertySet.forEach((handler) => {
      try {
        handler({ oldValue, newValue });
      } catch (ex) {
        genericCatch('Exception in property change handler')(ex);
      }
    });
  }
};

export const clearPropertyChangeListeners = () => {
  handlers.clear();
};
