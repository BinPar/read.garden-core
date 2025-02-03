import type { FlowConfig } from '@/@types/config/flow';

export interface FlowState {
  layout: 'flow';

  fontsCssLoaded: boolean;

  chapterStart: HTMLDivElement;
  chapterEnd: HTMLDivElement;
  snapsContainer: HTMLDivElement;
  contentBySnap: Map<number, string>;
  snapByContent: Map<string, number>;
  previousContent: string | null;

  columnWidth: number;
  columnCount: number;
  columnGap: number;

  fontFamily: string;
  fontSize: number;
  lineHeight: FlowConfig['lineHeight'];
  textAlign: FlowConfig['textAlign'];
  fontsUrls: Map<string, string[]>;

  snaps: Set<number>;
  firstSnap: number;
  lastSnap: number;
  goToEnd: boolean;
}
