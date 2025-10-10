import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

export const getZoom = (content: Element) => {
  const state = getState();
  const config = getConfig();

  const verticalPadding = config.padding.top + config.padding.bottom;
  const wrapperHeight = state.wrapper.clientHeight - verticalPadding;
  // Support double-page height by using the tallest page
  const leftChild = state.content?.firstElementChild;
  const rightChild = state.contentRight?.firstElementChild;

  const leftHeight = leftChild?.clientHeight ?? content.clientHeight;
  const rightHeight = rightChild?.clientHeight ?? 0;
  const maxHeight = Math.max(leftHeight, rightHeight);

  return (wrapperHeight / maxHeight) * 100;
};

const fitHeight = () => {
  const state = getState();
  if (state.layout !== 'fixed') {
    return;
  }

  const content = state.content.firstElementChild;

  if (!content) {
    return;
  }

  const zoom = getZoom(content);
  updateState({ zoom, fitMode: 'height' });
};

export default fitHeight;
