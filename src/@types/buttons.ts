export type ButtonType = 'forward' | 'backward';

export interface Button {
  type: ButtonType;
  text?: string;
  icon?: string;
  title?: string;
}
