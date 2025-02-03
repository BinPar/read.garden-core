import type { Button, ButtonType } from '@/@types/buttons';
import type { Direction, Layout } from '@/@types/common';
import type { FixedConfig, RequiredFixedConfig } from '@/@types/config/fixed';
import type { FlowConfig, RequiredFlowConfig } from '@/@types/config/flow';
import type { JsonData } from '@/@types/rg';
import type { SelectionOption } from '@/@types/selection';
import type { FullState } from '@/@types/state';

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
  cssHref: string;
  padding: MarginOrPadding;
  readModeMargin: MarginOrPadding;
  uiModeScale: number;
  uiModeTop: number;
  uiModeLeft: number;
  baseUrl?: string;
  jsonData?: JsonData;
  initialContentSlug?: string;
  selectionMenuOptions?: SelectionOption[];
}

export type RequiredOptions = Required<
  Pick<CommonConfig, 'direction' | 'cssHref'>
>;
export type OptionalOptions = Partial<
  Omit<CommonConfig, 'direction' | 'layout'>
>;
export type InitialOptions = RequiredOptions &
  OptionalOptions & { readMode?: boolean };

export type Config = CommonConfig &
  (({ layout: 'flow' } & FlowConfig) | ({ layout: 'fixed' } & FixedConfig));

export interface UIOptions {
  buttons?: (ButtonType | Button | Button<keyof FullState>)[];
}

export interface CommonOptions {
  layout: Layout;
  ui?: UIOptions;
}

export type Options = CommonOptions &
  (
    | {
        layout: 'flow';
        options: InitialOptions & Partial<FlowConfig> & RequiredFlowConfig;
      }
    | {
        layout: 'fixed';
        options: InitialOptions & Partial<FixedConfig> & RequiredFixedConfig;
      }
  );
