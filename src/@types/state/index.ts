import type { CoreContent } from '@/@types/common';
import type { DrawHighlights } from '@/@types/actions';
import type { Layout, Theme } from '@/@types/common';
import type { FixedState } from '@/@types/state/fixed';
import type { FlowState } from '@/@types/state/flow';
import type { UserHighlight } from '@/@types/selection';

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
  rendering: boolean;
  addingNote: boolean;

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
  noteMenu: HTMLDivElement;
  notesActions: HTMLDivElement;
  textarea: HTMLTextAreaElement;
  uiContainer?: HTMLDivElement;

  isSafari: boolean;

  contentsBySlug?: Map<string, CoreContent>;
  orderedContents?: CoreContent[];
  orderedContentSlugs?: string[];
  labelBySlug?: Map<string, string>;
  slugByLabel?: Map<string, string>;
  progressMode: 'percent' | 'label' | 'none';

  highlightsByKey: Map<string, HTMLDivElement[]>;
  highlightsById: Map<string | number, HTMLDivElement[]>;
  userHighlightsById: Map<string | number, UserHighlight>;

  selectedText: string;
  selectionRanges: Range[] | null;
  noteHighlightKey: string;
  noteHighlightRange: Range | null;
  noteHighlightText: string;
  highlightsLayers: Map<number, HTMLDivElement>;
  pendingDrawActions: DrawHighlights[];
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
