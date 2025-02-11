import type { HighlighterType } from '@/@types/common';

export interface SelectionOption {
  key: string | number;
  title: string;
  color: string;
  type: HighlighterType;
  className?: string;
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
  id?: string | number;
  key: string;
  highlighter: string | number;
  type: HighlighterType;
  color: string;
  range: SelectionRange;
  note?: string;
}

export type UserHighlight = Omit<Highlight, 'key'> &
  Required<Pick<Highlight, 'id'>>;
