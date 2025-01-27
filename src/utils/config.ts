import type { CommonConfig, Config, Options } from '@/@types/config';
import isTouchDevice from '@/tools/isTouchDevice';
import {
  defaultCommonConfig,
  defaultFixedConfig,
  defaultFlowConfig,
} from '@/utils/defaults';

let config: Config | undefined;

export const init = (initialOptions: Options) => {
  const { direction } = initialOptions.options;
  const touch = initialOptions.options.touch ?? isTouchDevice();

  const common: Omit<CommonConfig, 'layout'> = {
    direction,
    touch,
    padding: initialOptions.options.padding ?? defaultCommonConfig.padding,
    readModeMargin:
      initialOptions.options.readModeMargin ??
      defaultCommonConfig.readModeMargin,

    uiModeScale:
      initialOptions.options.uiModeScale ?? defaultCommonConfig.uiModeScale,
    uiModeTop:
      initialOptions.options.uiModeTop ?? defaultCommonConfig.uiModeTop,
    uiModeLeft:
      initialOptions.options.uiModeLeft ?? defaultCommonConfig.uiModeLeft,
    baseUrl: initialOptions.options.baseUrl,
    jsonData: initialOptions.options.jsonData,
    selectionMenuOptions: initialOptions.options.selectionMenuOptions,
  };

  if (initialOptions.layout === 'flow') {
    if (!initialOptions.options.fontFamily) {
      console.error('Missing font-family in options (required for flow)');
    }
    config = {
      layout: 'flow',
      ...common,

      maxColumns:
        initialOptions.options.maxColumns ?? defaultFlowConfig.maxColumns,
      maxCharsPerColumn:
        initialOptions.options.maxCharsPerColumn ??
        defaultFlowConfig.maxCharsPerColumn,
      minCharsPerColumn:
        initialOptions.options.minCharsPerColumn ??
        defaultFlowConfig.minCharsPerColumn,
      columnGap:
        initialOptions.options.columnGap ?? defaultFlowConfig.columnGap,
      minColumnGap:
        initialOptions.options.minColumnGap ?? defaultFlowConfig.minColumnGap,

      fontSize: initialOptions.options.fontSize ?? defaultFlowConfig.fontSize,
      fontFamily:
        initialOptions.options.fontFamily ?? defaultFlowConfig.fontFamily,
      lineHeight:
        initialOptions.options.lineHeight ?? defaultFlowConfig.lineHeight,
      textAlign:
        initialOptions.options.textAlign !== undefined
          ? initialOptions.options.textAlign
          : defaultFlowConfig.textAlign,
    };
  }

  if (initialOptions.layout === 'fixed') {
    config = {
      layout: 'fixed',
      ...common,
      paginated:
        initialOptions.options.paginated ?? defaultFixedConfig.paginated,
      gapMode: initialOptions.options.gapMode ?? defaultFixedConfig.gapMode,
      gapSize: initialOptions.options.gapSize ?? defaultFixedConfig.gapSize,
      maximumZoomValue:
        initialOptions.options.maximumZoomValue ??
        defaultFixedConfig.maximumZoomValue,
      minimumZoomValue:
        initialOptions.options.minimumZoomValue ??
        defaultFixedConfig.minimumZoomValue,
      zoom: initialOptions.options.zoom ?? defaultFixedConfig.zoom,
      fit: initialOptions.options.fit ?? defaultFixedConfig.fit,
    };
  }
};

export const getConfig = (): Config => {
  if (!config) {
    throw new Error('Config is not initialized');
  }
  return config;
};

export const updateConfig = (newConfig: Partial<Config>) => {
  if (!config) {
    throw new Error('Config is not initialized');
  }
  const keys = Array.from(Object.keys(newConfig));
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    if (key) {
      const configKey = key as keyof Config;
      const newValue = newConfig[configKey];
      if (newValue !== config[configKey]) {
        (config as Record<keyof Config, unknown>)[configKey] = newValue;
      }
    }
  }
};
