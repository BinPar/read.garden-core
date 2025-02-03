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
  lineHeight: 1 | 1.5 | 2;
  textAlign: 'start' | 'justify' | null;
}

export type RequiredFlowConfig = Required<Pick<FlowConfig, 'fontFamily'>>;
