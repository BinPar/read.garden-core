import { getState, updateState } from '@/utils/state';

const zoomOut = () => {
  const state = getState();

  if (state.layout === 'flow') {
    return;
  }
  
  updateState((current) => ({
    zoom: current.zoom - 5,
    fitMode: 'none',
  }));
};

export default zoomOut;
