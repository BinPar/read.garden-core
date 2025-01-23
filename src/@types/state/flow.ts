export interface FlowState {
  layout: 'flow';

  fontsCssLoaded: boolean;

  snapsContainer: HTMLDivElement;

  columnWidth: number;
  columnCount: number;
  columnGap: number;

  snaps: Set<number>;
  firstSnap: number;
  lastSnap: number;
  goToEnd: boolean;
}
