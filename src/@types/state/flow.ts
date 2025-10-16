import type { LineHeight, TextAlign } from '@/@types/common';

export type ContentRange = {
  from: number;
  to: number;
  slug: string;
};

export interface FlowState {
  layout: 'flow';

  fontsCssLoaded: boolean;

  chapterStart: HTMLDivElement;
  chapterStartRight?: HTMLDivElement;
  chapterEnd: HTMLDivElement;
  snapsContainer: HTMLDivElement;
  snapsContainerRight?: HTMLDivElement;
  contentBySnapRange: ContentRange[];
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
