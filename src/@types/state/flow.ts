export interface FlowState {
  layout: 'flow';

  snapsContainer: HTMLDivElement;
  pageLabelsContainer: HTMLDivElement;

  columnWidth: number;
  columnCount: number,
  columnGap: number;
  
  snaps: Set<number>;
}