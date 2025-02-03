import type { Config } from '@/@types/config';
import type { Highlight } from '@/@types/selection';
import type { PropertyChangeHandler, State, StateKey } from '@/@types/state';

export interface DrawHighlights {
  type: 'drawHighlights';
  payload: {
    highlights: Highlight[];
  };
}

export interface CreateHighlight {
  type: 'createHighlight';
  payload: {
    key: string;
    color: string;
    draw?: boolean;
    hideMenu?: boolean;
    clearSelection?: boolean;
  };
}

export interface MovePrev {
  type: 'movePrev';
}

export interface MoveNext {
  type: 'moveNext';
}

export interface AddOnChangeEvent<T extends StateKey = StateKey> {
  type: 'addOnChangeEvent';
  propertyName: T;
  event: PropertyChangeHandler<T>;
  returnValue?: boolean;
}

export type Action =
  | DrawHighlights
  | CreateHighlight
  | MovePrev
  | MoveNext
  | AddOnChangeEvent;

export type Actions = {
  [K in Action['type']]: (params: {
    action: Extract<Action, { type: K }>;
    state: State;
    config: Config;
  }) => void;
};

export type DispatchHandler<T extends Action['type']> = (params: {
  action: Extract<Action, { type: T }>;
  state: State;
  config: Config;
}) => void;

export type ActionHandler<T extends Action> = (params: {
  action: T;
  state: State;
  config: Config;
}) => void;
