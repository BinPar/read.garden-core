import type { FitMode } from '@/@types/common';
import fitHeight from '@/utils/fixed/fitHeight';
import fitPage from '@/utils/fixed/fitPage';
import fitWidth from '@/utils/fixed/fitWidth';
import { getState } from '@/utils/state';

const setFitMode = (fitMode: FitMode) => {
  const state = getState();

  if (state.layout !== 'fixed') {
    return;
  }

  if (fitMode === 'width') {
    fitWidth();
  }

  if (fitMode === 'height') {
    fitHeight();
  }

  if (fitMode === 'page') {
    fitPage();
  }
};

export default setFitMode;
