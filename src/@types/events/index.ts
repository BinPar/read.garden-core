import type { HighlighterType } from '@/@types/common';
import type { SelectionRange } from '@/@types/selection';

export interface EventWithSlugs {
  slug: string;
  /**
   * Product slug (in case it's different from main slug)
   */
  productSlug: string;
}

export interface ContentLoaded {
  type: 'contentLoaded';
  contentSlug: string;
}

export interface OnUserSelect {
  type: 'onUserSelect';
}

export interface OnLinkClick {
  type: 'onLinkClick';
  url: string | null;
  querySelector: string;
}

export interface OnNewHighlight {
  type: 'onNewHighlight';
  key: string;
  highlighter: string | number;
  range: SelectionRange;
  note?: string;
}

export interface OnHighlightClick {
  type: 'onHighlightClick';
  id: string;
  highlighterType: HighlighterType;
}

export interface OnHighlightRemove {
  type: 'onHighlightRemove';
  id: string | number;
}

export interface OnHighlightEdit {
  type: 'onHighlightEdit';
  id: string | number;
  highlighter: string | number;
}

export interface OnNoteEdit {
  type: 'onNoteEdit';
  id: string | number;
  note: string;
}

export type CoreEvent =
  | ContentLoaded
  | OnUserSelect
  | OnLinkClick
  | OnNewHighlight
  | OnHighlightClick
  | OnHighlightRemove
  | OnHighlightEdit
  | OnNoteEdit;

export type EventHandler<T extends CoreEvent = CoreEvent> = (
  event: T & EventWithSlugs,
) => void;
