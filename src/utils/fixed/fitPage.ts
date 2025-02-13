import { getZoom as getFitWidthZoom } from '@/utils/fixed/fitWidth';
import { getZoom as getFitHeightZoom } from '@/utils/fixed/fitHeight';
import { getState, updateState } from '@/utils/state';

const fitPage = () => {
  const state = getState();
  if (state.layout !== 'fixed') {
    return;
  }

  const content = state.content.firstElementChild;

  if (!content) {
    return;
  }

  const fitWidthZoom = getFitWidthZoom(content);
  const fitHeightZoom = getFitHeightZoom(content);
  const zoom = Math.min(fitWidthZoom, fitHeightZoom);
  updateState({ zoom, fitMode: 'page' });
};

export default fitPage;
