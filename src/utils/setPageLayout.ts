import type { SetPageLayout } from '@/@types/actions';
import { fixedSetup } from '@/utils/fixed/setup';
import { checkCenter } from '@/utils/fixed/setupEvents';
import { flowSetup } from '@/utils/flow/setup';
import loadContent from '@/utils/loadContent';
import redrawHighlights from '@/utils/redrawHighlights';
import { getState, updateState } from '@/utils/state';
import waitForRender from '@/utils/waitForRender';

const setPageLayout = (pageLayout: SetPageLayout['pageLayout']) => {
  const state = getState();
  let newPageLayout = pageLayout;
  if (newPageLayout === 'auto') {
    newPageLayout = state.pageLayout === 'double' ? 'single' : 'double';
  }
  updateState({ pageLayout: newPageLayout });
  state.container.classList.remove('single');
  state.container.classList.remove('double');
  state.container.classList.add(newPageLayout);
  const isLandscape = screen.orientation?.type?.includes('landscape');
  if (state.layout === 'flow') {
    flowSetup(true, true);
  }
  if (state.layout === 'fixed') {
    const currentContent = state.contentsBySlug?.get(state.contentSlug);
    if (currentContent) {
      loadContent(currentContent);
    }
    setTimeout(() => {
      const newFitMode = isLandscape ? 'height' : 'width';
      updateState({ fitMode: newFitMode });
      fixedSetup();
      waitForRender(() => {
        checkCenter();
        redrawHighlights();
      }, 100);
    }, 100);
  }
};

export default setPageLayout;
