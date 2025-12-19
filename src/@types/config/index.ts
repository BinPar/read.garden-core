import type { Button, ButtonType } from '@/@types/buttons';
import type { Direction, Layout, Theme } from '@/@types/common';
import type { FixedConfig, RequiredFixedConfig } from '@/@types/config/fixed';
import type { FlowConfig, RequiredFlowConfig } from '@/@types/config/flow';
import type { EventHandler } from '@/@types/events';
import type { JsonData } from '@/@types/rg';
import type { SelectionOption } from '@/@types/selection';
import type { FullState } from '@/@types/state';

type PartialProperties<T> = {
  [P in keyof T]: Partial<T[P]>;
};

export interface MarginOrPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CommonConfig {
  layout: Layout;
  direction: Direction;
  touch: boolean;
  theme?: Theme;
  lang?: string;
  cssHref: string;
  padding: MarginOrPadding;
  readModeMargin: MarginOrPadding;
  uiModeScale: number;
  uiModeTop: number;
  uiModeLeft: number;
  baseUrl?: string;
  customRouteForImages?: string;
  initAnimationsEnabled?: boolean;
  hideSnapText?: boolean;
  localBaseUrl?: string;
  jsonData?: JsonData;
  initialContentSlug?: string;
  selectionMenuOptions?: SelectionOption[];
  selectionHighlightColor: string;
  slug: string;
  productSlug?: string;
  eventHandler?: EventHandler;
  navigationBarHeight?: number;
  contentGapSize: number;
  autoPageLayout?: boolean;
  brightness: number;
  maxBrightness: number;
  minBrightness: number;
  brightnessStep: number;
  fitHeightInLandscape?: boolean;
}

export type RequiredOptionsKeys = 'direction';
export type RequiredInitialConfigKeys = 'layout' | 'slug' | 'cssHref';
export type OptionsMainKeys =
  | 'productSlug'
  | 'eventHandler'
  | 'baseUrl'
  | 'localBaseUrl'
  | 'customRouteForImages'
  | 'jsonData'
  | 'lang'
  | 'autoPageLayout';
export type PartialOptions = Partial<
  PartialProperties<Pick<CommonConfig, 'padding' | 'readModeMargin'>>
>;

export type RequiredOptions = Required<Pick<CommonConfig, RequiredOptionsKeys>>;
export type OptionalOptions = Partial<
  Omit<
    CommonConfig,
    RequiredOptionsKeys | OptionsMainKeys | RequiredInitialConfigKeys
  >
>;

export type InitialOptions = RequiredOptions &
  OptionalOptions &
  PartialOptions & { readMode?: boolean };

export type Config = CommonConfig &
  (({ layout: 'flow' } & FlowConfig) | ({ layout: 'fixed' } & FixedConfig));

export interface UIOptions {
  buttons?: (ButtonType | Button | Button<keyof FullState>)[];
  pageSelect?: boolean;
}

export type CommonOptions = Pick<CommonConfig, OptionsMainKeys>;

export type RequiredInitialConfig = Required<
  Pick<CommonConfig, RequiredInitialConfigKeys>
>;

export type Options = CommonOptions &
  RequiredInitialConfig & { ui?: UIOptions } & (
    | {
        layout: 'flow';
        options: InitialOptions & Partial<FlowConfig> & RequiredFlowConfig;
      }
    | {
        layout: 'fixed';
        options: InitialOptions & Partial<FixedConfig> & RequiredFixedConfig;
      }
  );
