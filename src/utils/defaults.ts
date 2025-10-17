import type { FlowConfig } from '@/@types/config/flow';
import type { FixedConfig } from '@/@types/config/fixed';
import type { CommonConfig } from '@/@types/config';
import type { FullState } from '@/@types/state';

export const defaultCommonConfig: Required<
  Pick<
    CommonConfig,
    | 'padding'
    | 'readModeMargin'
    | 'uiModeTop'
    | 'uiModeLeft'
    | 'uiModeScale'
    | 'lang'
    | 'selectionHighlightColor'
    | 'contentGapSize'
    | 'autoPageLayout'
  >
> = {
  lang: 'es',
  padding: {
    top: 32,
    right: 0,
    bottom: 64,
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
  selectionHighlightColor: '#ff0',
  contentGapSize: 5,
  autoPageLayout: false,
};

export const defaultFlowConfig: Required<Omit<FlowConfig, 'layout'>> = {
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
  minCharsPerColumn: 35,
  maxCharsPerColumn: 80,
  textAlign: null,
  columnGap: 108,
  minColumnGap: 32,
  pageLabelsTransformY: 0,
};

export const defaultFixedConfig: Required<Omit<FixedConfig, 'layout'>> = {
  maximumZoomValue: 4,
  minimumZoomValue: 0.5,
  paginated: true,
  fitMode: 'page',
  zoom: 100,
  gapMode: 'pairs',
  gapSize: 16,
  navigationBarHeight: 0,
};

export const defaultState: Required<
  Pick<FullState, 'readMode' | 'progressMode' | 'theme'>
> = {
  theme: 'light',
  readMode: true,
  progressMode: 'percent',
};
