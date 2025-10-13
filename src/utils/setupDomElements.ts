import type { Options } from '@/@types/config';
import type { State } from '@/@types/state';
import { updateState } from '@/utils/state';

const setupDomElements = (
  initialOptions: Options,
): Pick<
  State,
  | 'iframe'
  | 'win'
  | 'doc'
  | 'container'
  | 'viewer'
  | 'wrapper'
  | 'highlights'
  | 'content'
  | 'progress'
  | 'preload'
  | 'selectionMenu'
  | 'noteMenu'
  | 'textarea'
  | 'notesActions'
  | 'contentRight'
  | 'highlightsRight'
> => {
  const iframe = document.createElement('iframe');
  iframe.id = 'rg-iframe';
  iframe.name = 'Read Garden Viewer';
  iframe.title = 'Read Garden Viewer';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
  const iframeWin = iframe.contentWindow;

  if (!iframeDoc || !iframeWin) {
    throw new Error(`Can't find iframe document or window`);
  }

  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'user-scalable=0, width=device-width, initial-scale=1';

  window.parent.parent.document.head.appendChild(meta);

  const styles = iframeDoc.createElement('link');
  styles.onload = () => {
    window.requestAnimationFrame(() => {
      iframeDoc.body.appendChild(container);
      updateState((current) => {
        if (
          current.contentCssLoaded &&
          (current.layout === 'fixed' || current.fontsCssLoaded)
        ) {
          return { coreCssLoaded: true, loadingStyles: false };
        }
        return { coreCssLoaded: true };
      });
    });
  };
  styles.rel = 'stylesheet';
  styles.type = 'text/css';
  styles.href = initialOptions.cssHref;
  iframeDoc.head.appendChild(styles);

  if (initialOptions.ui) {
    const uiStyles = iframeDoc.createElement('link');
    uiStyles.rel = 'stylesheet';
    uiStyles.type = 'text/css';
    uiStyles.href = '/css/rg-ui.css';
    iframeDoc.head.appendChild(uiStyles);
  }

  const container = iframeDoc.createElement('div');
  if (!initialOptions.options?.isEReader) {
    container.classList.add('animated');
  }
  container.id = 'container';

  const backgroundCleaner = iframeDoc.createElement('div');
  backgroundCleaner.id = 'bg-cleaner';
  container.appendChild(backgroundCleaner);

  const viewer = iframeDoc.createElement('div');
  viewer.id = 'viewer';
  container.appendChild(viewer);

  const wrapper = iframeDoc.createElement('div');
  wrapper.id = 'wrapper';
  viewer.appendChild(wrapper);

  let content = iframeDoc.createElement('div');
  content.id = 'content';

  let contentRight: HTMLDivElement | undefined;

  const highlights = iframeDoc.createElement('div');
  highlights.id = 'highlights';
  let highlightsRight: HTMLDivElement | undefined;

  if (initialOptions.layout === 'fixed') {
    const contentPlaceholder = iframeDoc.createElement('div');
    contentPlaceholder.id = 'content-placeholder';
    wrapper.appendChild(contentPlaceholder);

    // Support two-page layout when configured
    content = iframeDoc.createElement('div');
    content.id = 'content';
    content.classList.add('content');
    contentRight = iframeDoc.createElement('div');
    contentRight.id = 'content';
    contentRight.classList.add('content');

    // Create a second highlights container for the right page
    highlightsRight = iframeDoc.createElement('div');
    highlightsRight.id = 'highlights-right';

    contentPlaceholder.appendChild(content);
    contentPlaceholder.appendChild(contentRight);
    // Attach highlights overlays to each page container
    content.appendChild(highlights);
    contentRight.appendChild(highlightsRight);
  } else {
    wrapper.appendChild(content);
    // Attach single highlights container in flow/single fixed
    wrapper.appendChild(highlights);
  }

  const selectionMenu = iframeDoc.createElement('div');
  selectionMenu.id = 'selection-menu';
  if (initialOptions.options.navigationBarHeight)
    selectionMenu.style.marginBottom = `${initialOptions.options.navigationBarHeight}px`;
  container.appendChild(selectionMenu);

  const noteMenu = iframeDoc.createElement('div');
  noteMenu.id = 'note-menu';
  const textarea = iframeDoc.createElement('textarea');
  noteMenu.appendChild(textarea);
  const notesActions = iframeDoc.createElement('div');
  notesActions.id = 'note-options';
  noteMenu.appendChild(notesActions);
  container.appendChild(noteMenu);

  const preload = iframeDoc.createElement('div');
  preload.id = 'preload';
  container.appendChild(preload);

  const progress = iframeDoc.createElement('div');
  progress.id = 'progress';
  container.appendChild(progress);

  return {
    doc: iframeDoc,
    win: iframeWin,
    iframe,
    container,
    highlights,
    viewer,
    wrapper,
    content,
    progress,
    selectionMenu,
    noteMenu,
    textarea,
    notesActions,
    preload,
    contentRight,
    // Expose right highlights for double-page
    highlightsRight,
  };
};

export default setupDomElements;
