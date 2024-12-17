interface Target {
  src: string;
  label?: string;
  uri?: string;
}

export interface SpineNode {
  title: string;
  target: Target;
  children?: SpineNode[];
}

export interface FlowContent {
  file: string;
  labels: string[];
}

export interface FixedContent {
  file: string;
  labels: [string];
  thumbUrl: string;
  width: number;
  height: number;
  bgUrl: string;
}

export interface CommonData {
  isbn: string;
  slug: string;
  initialContentSlug: string;
  cssURL: string;
  spine: SpineNode[];
  type: 'flow' | 'fixed';
}

export interface FlowData extends CommonData {
  type: 'flow';
  contents: FlowContent[];
}

export interface FixedData extends CommonData {
  type: 'fixed';
  contents: FixedContent[];
}

export type JsonData = FlowData | FixedData;
