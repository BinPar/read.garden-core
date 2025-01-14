export type ButtonType = 'forward' | 'backward' | 'switchMode';

export interface Button {
  type: ButtonType;
  text?: string;
  icon?: string;
  title?: string;
}
