import type { FullState } from '@/@types/state';

export type ButtonType =
  | 'forward'
  | 'backward'
  | 'switchMode'
  | 'zoomIn'
  | 'zoomOut'
  | 'increaseFont'
  | 'decreaseFont'
  | 'setFontFamily';

export interface Button<T extends keyof FullState = never> {
  type: ButtonType;
  text?: string;
  icon?: string;
  title?: string;
  prop?: T;
  value?: FullState[T];
}
