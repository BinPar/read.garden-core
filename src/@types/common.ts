export type Theme = 'light' | 'dark';
export type Layout = 'fixed' | 'flow';
export type Direction = 'horizontal' | 'vertical';
export type GapMode = 'all' | 'pairs' | 'none';

export type FitMode = 'width' | 'height' | 'page' | 'none';

export type TextAlign = 'start' | 'justify' | null;
export type LineHeight = 1.25 | 1.5 | 1.75;

export type HighlighterType = 'highlighter' | 'note';

export type CssVariableKey =
  | 'column-count'
  | 'column-gap'
  | 'column-width'
  | 'column-rule-width'
  | 'padding-top'
  | 'padding-bottom'
  | 'padding-left'
  | 'padding-right'
  | 'viewer-margin-top'
  | 'font-family'
  | 'font-size'
  | 'line-height'
  | 'text-align'
  | 'zoom'
  | 'fixed-left'
  | 'fixed-top'
  | 'ui-scale'
  | 'ui-top'
  | 'ui-left'
  | 'flow-left-threshold'
  | 'flow-right-threshold'
  | 'scroll-behavior'
  | 'scroll-snap-type'
  | 'overflow-x'
  | 'pages-labels-transform-y';

export interface CoreContent {
  file: string;
  html: string;
  order: number;
  slug: string;
  prev?: CoreContent;
  next?: CoreContent;
}
