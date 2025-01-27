import type { CoreContent } from '@/@types';
import type { Layout } from '@/@types/common';
import type { FixedState } from '@/@types/state/fixed';
import type { FlowState } from '@/@types/state/flow';

export interface CommonState {
  layout: Layout;

  slug: string;
  productSlug: string;
  contentSlug: string;
  contentOrder: number;
  pendingContents: Set<number>;

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
  selectionMenu: HTMLDivElement;
  isSafari: boolean;

  uiContainer?: HTMLDivElement;

  readMode: boolean;

  contentsBySlug?: Map<string, CoreContent>;
  orderedContents?: CoreContent[];

  selectedText: string;
  selectionRanges: Range[] | null;
}

export type State = CommonState & (FixedState | FlowState);

export type FullState = CommonState &
  Omit<FixedState, 'layout'> &
  Omit<FlowState, 'layout'>;
