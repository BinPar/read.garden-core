import type { LineHeight, TextAlign } from '@/@types/common';

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
  lineHeight: LineHeight;
  textAlign: TextAlign;
  fontsUrls: Map<string, string[]>;

  snaps: Set<number>;
  firstSnap: number;
  lastSnap: number;
  goToEnd: boolean;
}
