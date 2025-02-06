export interface SelectionOption {
  key: string;
  title: string;
  color: string;
  type: 'highlight' | 'note';
  className?: string;
  style?: string;
  selected?: boolean;
}

export interface SelectionPointer {
  querySelector: string;
  offset: number;
}

export interface SelectionRange {
  obfuscatedText: string;
  start: SelectionPointer;
  end: SelectionPointer;
}

export interface Highlight {
  key: string;
  color: string;
  range: SelectionRange;
  // clear?: boolean;
}
