import { getConfig } from '@/utils/config';
import { getState, updateState } from '@/utils/state';

export const getZoom = (content: Element) => {
  const state = getState();
  const config = getConfig();

  const verticalPadding = config.padding.top + config.padding.bottom;
  const wrapperHeight = state.wrapper.clientHeight - verticalPadding;
  const contentHeight = content.clientHeight;
  return (wrapperHeight / contentHeight) * 100;
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
