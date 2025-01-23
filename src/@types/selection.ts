export interface SelectionOption {
  key: string;
  title: string;
  color: string;
  isNote?: boolean;
  className?: string;
  style?: string;
  selected?: boolean;
}