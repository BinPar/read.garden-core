import type { Options } from '@/@types/config';
import { updateState } from '@/utils/state';

const setupDomElements = (initialOptions: Options) => {
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
    console.log('styles.css loaded');
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
  styles.href = '/css/styles.css';
  iframeDoc.head.appendChild(styles);

  if (initialOptions.ui) {
    const uiStyles = iframeDoc.createElement('link');
    uiStyles.rel = 'stylesheet';
    uiStyles.type = 'text/css';
    uiStyles.href = '/css/rg-ui.css';
    iframeDoc.head.appendChild(uiStyles);
  }

  const container = iframeDoc.createElement('div');
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

  const content = iframeDoc.createElement('div');
  content.id = 'content';

  if (initialOptions.layout === 'fixed') {
    const contentPlaceholder = iframeDoc.createElement('div');
    contentPlaceholder.id = 'content-placeholder';
    wrapper.appendChild(contentPlaceholder);
    contentPlaceholder.appendChild(content);
  }

  if (initialOptions.layout === 'flow') {
    const chapterStart = iframeDoc.createElement('div');
    chapterStart.id = 'chapter-start';
    wrapper.appendChild(chapterStart);

    wrapper.appendChild(content);

    const chapterEnd = iframeDoc.createElement('div');
    chapterEnd.id = 'chapter-end';
    wrapper.appendChild(chapterEnd);
  }

  const selectionMenu = iframeDoc.createElement('div');
  selectionMenu.id = 'selection-menu';
  viewer.appendChild(selectionMenu);

  return {
    doc: iframeDoc,
    win: iframeWin,
    iframe,
    container,
    viewer,
    wrapper,
    content,
    selectionMenu,
  };
};

export default setupDomElements;
