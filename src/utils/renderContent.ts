import setCssVariable from '@/tools/setCssVariable';
import { getState, updateState } from '@/utils/state';

const renderContent = (leftHtml: string, rightHtml?: string) => {
  const state = getState();
  updateState({ rendering: true });
  setCssVariable('viewer-margin-top', '200svh');

  // If double-page layout is active, render into left/right containers
  if (state.layout === 'fixed' && state.content && state.contentRight) {
    state.content.innerHTML = leftHtml;
    state.contentRight.innerHTML = rightHtml ?? '';
    return;
  }

  // Fallback to single content container
  state.content.innerHTML = leftHtml;
};

export default renderContent;
