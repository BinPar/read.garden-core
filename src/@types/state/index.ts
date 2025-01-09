import type { CoreContent } from '@/@types';
import type { Layout } from '@/@types/common';
import type { FixedState } from '@/@types/state/fixed';
import type { FlowState } from '@/@types/state/flow';

export interface CommonState {
  layout: Layout;
  slug: string;
  productSlug: string;
  contentSlug: string;

  containerWidth: number;
  containerHeight: number;

  doc: Document;
  container: HTMLDivElement;
  viewer: HTMLDivElement;
  wrapper: HTMLDivElement;
  content: HTMLDivElement;

  readMode: boolean;

  contentsBySlug?: Map<string, CoreContent>;
}

export type State = CommonState & (FixedState | FlowState);
