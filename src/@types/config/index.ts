import type { Button, ButtonType } from '@/@types/buttons';
import type { Direction, Layout } from '@/@types/common';
import type { FixedConfig } from '@/@types/config/fixed';
import type { FlowConfig } from '@/@types/config/flow';
import type { JsonData } from '@/@types/rg';

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
  padding: MarginOrPadding;
  readModeMargin: MarginOrPadding;
  uiModeMargin: MarginOrPadding;
  baseUrl?: string;
  jsonData?: JsonData;
  initialContentSlug?: string;
}

export type RequiredOptions = Required<Pick<CommonConfig, 'direction'>>;
export type OptionalOptions = Partial<
  Omit<CommonConfig, 'direction' | 'layout'>
>;
export type InitialOptions = RequiredOptions &
  OptionalOptions & { readMode?: boolean };

export type Config = CommonConfig &
  (({ layout: 'flow' } & FlowConfig) | ({ layout: 'fixed' } & FixedConfig));

export interface UIOptions {
  buttons?: ButtonType[] | Button[];
}

export interface CommonOptions {
  layout: Layout;
  ui?: UIOptions;
}

export type Options = CommonOptions &
  (
    | {
        layout: 'flow';
        options: InitialOptions & Partial<FlowConfig>;
      }
    | {
        layout: 'fixed';
        options: InitialOptions & Partial<FixedConfig>;
      }
  );
