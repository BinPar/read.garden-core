import type setup from '@/utils/setup';

declare global {
  interface Window {
    rgCore: ReturnType<typeof setup>;
    readGardenCore: typeof setup;
  }
}

export interface CoreContent {
  file: string;
  html: string;
  order: number;
  slug: string;
  prev?: CoreContent;
  next?: CoreContent;
}

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
  | 'overflow-x';
