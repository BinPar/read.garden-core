import type { FlowConfig } from '@/@types/config/flow';
import type { FixedConfig } from '@/@types/config/fixed';
import type { CommonConfig } from '@/@types/config';

export const defaultCommonConfig: Pick<CommonConfig, 'padding' | 'readModeMargin' | 'uiModeMargin'> = {
  padding: {
    top: 60,
    right: 0,
    bottom: 60,
    left: 0,
  },
  readModeMargin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  uiModeMargin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 140,
  },
}

export const defaultFlowConfig: Omit<FlowConfig, 'layout'> = {
  fontSize: 16,
  lineHeight: 1.5,
  maxColumns: 4,
  minCharsPerColumn: 60,
  maxCharsPerColumn: 80,
  textAlign: null,
  columnGap: 216,
}

export const defaultFixedConfig: Omit<FixedConfig, 'layout'> = {
  maximumZoomValue: 4,
  minimumZoomValue: 0.5,
  fit: 'page',
  zoom: 1,
  gapMode: 'pairs',
  gapSize: 16,
}

export const defaultState = {
  readMode: true,
};
