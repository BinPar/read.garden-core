export interface FixedConfig {
  fit?: 'width' | 'height' | 'page';
  gapMode: 'all' | 'pairs' | 'none';
  gapSize: number;
  maximumZoomValue: number;
  minimumZoomValue: number;
  zoom: number;
}