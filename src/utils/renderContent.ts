import setCssVariable from '@/tools/setCssVariable';
import { getState, updateState } from '@/utils/state';

const renderContent = (html: string) => {
  const state = getState();
  updateState({ rendering: true });
  setCssVariable('viewer-margin-top', '200svh');
  state.content.innerHTML = html;
};

export default renderContent;
