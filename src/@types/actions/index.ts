import type { FitMode, LineHeight, TextAlign, Theme } from '@/@types/common';
import type { Config } from '@/@types/config';
import type { SelectionOption, UserHighlight } from '@/@types/selection';
import type { PropertyChangeHandler, State, StateKey } from '@/@types/state';

export interface AddOnChangeEvent<T extends StateKey = StateKey> {
  type: 'addOnChangeEvent';
  propertyName: T;
  event: PropertyChangeHandler<T>;
  returnValue?: boolean;
}

export interface SetTheme {
  type: 'setTheme';
  theme: Theme;
}

export interface SetFitMode {
  type: 'setFitMode';
  fitMode: FitMode;
}

export interface SetPageLayout {
  type: 'setPageLayout';
  pageLayout: 'single' | 'double';
}

export interface SetAnimationsEnabled {
  type: 'setAnimationsEnabled';
  animationsEnabled: boolean;
}

export interface MovePrev {
  type: 'movePrev';
}

export interface MoveNext {
  type: 'moveNext';
}

export interface IncreaseFontSize {
  type: 'increaseFontSize';
}

export interface DecreaseFontSize {
  type: 'decreaseFontSize';
}

export interface IncreaseBrightness {
  type: 'increaseBrightness';
}

export interface DecreaseBrightness {
  type: 'decreaseBrightness';
}

export interface SetBrightness {
  type: 'setBrightness';
  brightness: number;
}

export interface SetLineHeight {
  type: 'setLineHeight';
  lineHeight: LineHeight;
}

export interface SetTextAlign {
  type: 'setTextAlign';
  textAlign: TextAlign;
}

export interface SetFontFamily {
  type: 'setFontFamily';
  fontFamily: string;
}

export interface NavigateToPage {
  type: 'navigateToPage';
  contentSlug: string;
}

export interface ShowSelectionMenu {
  type: 'showSelectionMenu';
  options: SelectionOption[];
  id?: string | number;
  deleteOption?: boolean | string;
}

export interface ConfirmHighlight {
  type: 'confirmHighlight';
  key: string;
  id: string | number;
}

export interface CancelHighlight {
  type: 'cancelHighlight';
  key: string;
}

export interface CancelHighlight {
  type: 'cancelHighlight';
  key: string;
}

export interface DrawHighlights {
  type: 'drawHighlights';
  highlights: UserHighlight[];
}

export interface RemoveHighlights {
  type: 'removeHighlights';
  ids: (string | number)[];
}

export type Action =
  | SetTheme
  | DrawHighlights
  | RemoveHighlights
  | MovePrev
  | MoveNext
  | AddOnChangeEvent
  | IncreaseFontSize
  | DecreaseFontSize
  | SetLineHeight
  | SetTextAlign
  | SetFontFamily
  | NavigateToPage
  | ShowSelectionMenu
  | ConfirmHighlight
  | CancelHighlight
  | SetFitMode
  | SetPageLayout
  | SetAnimationsEnabled
  | IncreaseBrightness
  | DecreaseBrightness
  | SetBrightness;

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
