import type { FitMode } from '@/@types/common';

export interface FixedState {
  layout: 'fixed';
  zoom: number;
  fitMode: FitMode;
  contentRight?: HTMLDivElement;
  rightContentSlug?: string;
}
