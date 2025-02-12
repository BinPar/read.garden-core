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
  highlighter: string | number;
  type: HighlighterType;
  color: string;
  note?: string;
}

export type CoreHighlight = Highlight & {
  key: string;
  text: string;
  range: Range;
  selectionRange: SelectionRange;
  domHighlights: HTMLDivElement[];
};

export type UserHighlight = Highlight & {
  id: string | number;
  range: SelectionRange;
};

export interface CurrentSelection {
  range: Range;
  text: string;
}