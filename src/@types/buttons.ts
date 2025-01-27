export type ButtonType =
  | 'forward'
  | 'backward'
  | 'switchMode'
  | 'zoomIn'
  | 'zoomOut';

export interface Button {
  type: ButtonType;
  text?: string;
  icon?: string;
  title?: string;
}
