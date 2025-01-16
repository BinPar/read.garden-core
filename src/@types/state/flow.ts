export interface FlowState {
  layout: 'flow';

  fontsCssLoaded: boolean;

  snapsContainer: HTMLDivElement;
  pageLabelsContainer: HTMLDivElement;

  columnWidth: number;
  columnCount: number,
  columnGap: number;
  
  snaps: Set<number>;
}