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
}

export type CssVariableKey =
  | 'column-count'
  | 'column-gap'
  | 'column-width'
  | 'padding-top'
  | 'padding-bottom'
  | 'viewer-margin-top';
