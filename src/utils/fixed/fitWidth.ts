import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

export const getZoom = (content: Element) => {
  const state = getState();
  const config = getConfig();

  const horizontalPadding = config.padding.left + config.padding.right;
  const wrapperWidth = state.wrapper.clientWidth - horizontalPadding;

  // Support double-page width by summing left + right + gap
  const leftChild = state.content?.firstElementChild;
  const rightChild = state.contentRight?.firstElementChild;

  if (leftChild && rightChild) {
    const gap = state.pageLayout === 'double' ? config.contentGapSize : 0;
    const totalWidth = leftChild.clientWidth + rightChild.clientWidth + gap;
    return (wrapperWidth / totalWidth) * 100;
  }

  const contentWidth = leftChild?.clientWidth ?? content.clientWidth;
  return (wrapperWidth / contentWidth) * 100;
};

const fitWidth = () => {
  const state = getState();
  if (state.layout !== 'fixed') {
    return;
  }

  const content = state.content.firstElementChild;

  if (!content) {
    return;
  }

  const zoom = getZoom(content);
  updateState({ zoom, fitMode: 'width' });
};

export default fitWidth;
