import type { CoreContent } from '@/@types';
import type { Layout, Theme } from '@/@types/common';
import type { FixedState } from '@/@types/state/fixed';
import type { FlowState } from '@/@types/state/flow';

export interface CommonState {
  theme: Theme;
  layout: Layout;
  readMode: boolean;

  contentSlug: string;
  contentOrder: number;
  pendingContents: Set<number>;
  loadingContents: Set<number>;

  initialized: boolean;
  loadingStyles: boolean;
  coreCssLoaded: boolean;
  contentCssLoaded: boolean;

  containerWidth: number;
  containerHeight: number;

  iframe: HTMLIFrameElement;
  win: Window;
  doc: Document;
  container: HTMLDivElement;
  viewer: HTMLDivElement;
  wrapper: HTMLDivElement;
  content: HTMLDivElement;
  highlights: HTMLDivElement;
  progress: HTMLDivElement;
  preload: HTMLDivElement;
  selectionMenu: HTMLDivElement;
  uiContainer?: HTMLDivElement;

  isSafari: boolean;

  contentsBySlug?: Map<string, CoreContent>;
  orderedContents?: CoreContent[];
  orderedContentSlugs?: string[];
  labelBySlug?: Map<string, string>;
  slugByLabel?: Map<string, string>;
  progressMode: 'percent' | 'label' | 'none';

  selectedText: string;
  selectionRanges: Range[] | null;
  highlightsLayers: Map<number, HTMLDivElement>;
}

export type State = CommonState & (FixedState | FlowState);

export type FullState = CommonState &
  Omit<FixedState, 'layout'> &
  Omit<FlowState, 'layout'>;

export type StateKey = keyof FullState;

export type PropertyChangeHandler<K extends StateKey> = (props: {
  oldValue: FullState[K];
  newValue: FullState[K];
}) => void;
