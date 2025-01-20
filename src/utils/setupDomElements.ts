import type { Options } from '@/@types/config';
import { updateState } from '@/utils/state';

const setupDomElements = (initialOptions: Options) => {
  const iframe = document.createElement('iframe');
  iframe.id = 'rg-iframe';
  document.body.appendChild(iframe);

  console.log({ iframe });

  const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;

  if (!iframeDoc) {
    throw new Error(`Can't find iframe document`);
  }

  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'user-scalable=0, width=device-width, initial-scale=1';

  window.parent.parent.document.head.appendChild(meta);

  const styles = iframeDoc.createElement('link');
  styles.rel = 'stylesheet';
  styles.type = 'text/css';
  styles.href = '/css/styles.css';
  styles.onload = () => {
    console.log('styles.css loaded');
    updateState((current) => {
      if (
        current.contentCssLoaded &&
        (current.layout === 'fixed' || current.fontsCssLoaded)
      ) {
        return { coreCssLoaded: true, loadingStyles: false };
      }
      return { coreCssLoaded: true };
    });
  };
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
  wrapper.appendChild(content);

  iframeDoc.body.appendChild(container);

  return {
    doc: iframeDoc,
    container,
    viewer,
    wrapper,
    content,
  };
};

export default setupDomElements;
