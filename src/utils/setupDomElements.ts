const setupDomElements = () => {
  const iframe = document.createElement('iframe');
  iframe.id = 'rg-iframe';
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;

  if (!iframeDoc) {
    throw new Error(`Can't find iframe document`);
  }
  
  const styles = iframeDoc.createElement('link');
  styles.rel = 'stylesheet';
  styles.type = 'text/css';
  styles.href = '/css/styles.css';
  iframeDoc.head.appendChild(styles);

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
