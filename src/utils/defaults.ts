import type { FlowConfig } from '@/@types/config/flow';
import type { FixedConfig } from '@/@types/config/fixed';
import type { CommonConfig } from '@/@types/config';
import type { FullState } from '@/@types/state';

export const defaultCommonConfig: Pick<
  CommonConfig,
  'padding' | 'readModeMargin' | 'uiModeTop' | 'uiModeLeft' | 'uiModeScale'
> = {
  padding: {
    top: 32,
    right: 0,
    bottom: 56,
    left: 0,
  },
  readModeMargin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  uiModeTop: 0,
  uiModeLeft: 0,
  uiModeScale: 0.75,
};

export const defaultFlowConfig: Omit<FlowConfig, 'layout'> = {
  fontSize: 18,
  fontSizeStep: 2,
  minFontSize: 12,
  maxFontSize: 36,
  fontFamily: 'Obf-Helvetica',
  fontFamilies: [
    'Obf-Helvetica',
    'Obf-TimesNewRoman',
    'Obf-AmericanTypewriter',
    'Obf-Baskerville',
    'Obf-OpenDyslexic',
    'Obf-RobotoSlab',
    'Obf-Tahoma',
  ],
  lineHeight: 1.5,
  maxColumns: 4,
  minCharsPerColumn: 60,
  maxCharsPerColumn: 80,
  textAlign: null,
  columnGap: 216,
  minColumnGap: 16,
};

export const defaultFixedConfig: Omit<FixedConfig, 'layout'> = {
  maximumZoomValue: 4,
  minimumZoomValue: 0.5,
  paginated: true,
  fit: 'page',
  zoom: 100,
  gapMode: 'pairs',
  gapSize: 16,
};

export const defaultState: Pick<FullState, 'readMode' | 'progressMode'> = {
  readMode: true,
  progressMode: 'percent',
};
