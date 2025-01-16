export interface FlowConfig {
  maxColumns: number;
  minCharsPerColumn: number;
  maxCharsPerColumn: number;
  columnGap: number;
  minColumnGap: number;

  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  textAlign: number | null;
}

export type RequiredFlowConfig = Required<Pick<FlowConfig, 'fontFamily'>>;
