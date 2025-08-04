import type { FitMode, GapMode } from '@/@types/common';

export interface FixedConfig {
  fitMode?: FitMode;
  gapMode: GapMode;
  paginated: boolean;
  gapSize: number;
  maximumZoomValue: number;
  minimumZoomValue: number;
  zoom: number;
  navigationBarHeight: number;
}

export type RequiredFixedConfig = Required<
  Pick<FixedConfig, 'minimumZoomValue' | 'maximumZoomValue'>
>;
