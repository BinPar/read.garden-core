import type { LineHeight, TextAlign } from '@/@types/common';

export interface FlowConfig {
  maxColumns: number;
  minCharsPerColumn: number;
  maxCharsPerColumn: number;
  columnGap: number;
  minColumnGap: number;

  fontSize: number;
  minFontSize: number;
  maxFontSize: number;
  fontSizeStep: number;
  fontFamily: string;
  fontFamilies: string[];
  lineHeight: LineHeight;
  textAlign: TextAlign;
  pageLabelsTransformY?: number;
}

export type RequiredFlowConfig = Required<Pick<FlowConfig, 'fontFamily'>>;
