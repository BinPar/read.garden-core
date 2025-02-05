import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

export const getZoom = (content: Element) => {
  const state = getState();
  const config = getConfig();

  const horizontalPadding = config.padding.left + config.padding.right;
  const wrapperWidth = state.wrapper.clientWidth - horizontalPadding;
  const contentWidth = content.clientWidth;
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
