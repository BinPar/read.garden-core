import setCssVariable from '@/tools/setCssVariable';
import { getState } from '@/utils/state';

const renderContent = (html: string) => {
  const state = getState();
  setCssVariable('viewer-margin-top', '200svh');
  state.content.innerHTML = html;
};

export default renderContent;
