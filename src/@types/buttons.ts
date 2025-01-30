export type ButtonType =
  | 'forward'
  | 'backward'
  | 'switchMode'
  | 'zoomIn'
  | 'zoomOut'
  | 'increaseFont'
  | 'decreaseFont';

export interface Button {
  type: ButtonType;
  text?: string;
  icon?: string;
  title?: string;
}
