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

// export interface LinkLoaded {
//   type: 'onLinkLoaded';
//   link: string;
//   href: string | null;
//   target: string | null;
// }



export interface OnUserSelect {
  type: 'onUserSelect';
}

export interface OnLinkClick {
  type: 'onLinkClick';
  url: string | null;
  querySelector: string;
}

export type CoreEvent = ContentLoaded | OnUserSelect | OnLinkClick;

export type EventHandler<T extends CoreEvent = CoreEvent> = (
  event: T & EventWithSlugs,
) => void;
