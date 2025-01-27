import setCssVariable from '@/tools/setCssVariable';
import { getState } from '@/utils/state';

const renderContent = (html: string, state = getState()) => {
  setCssVariable('viewer-margin-top', '200svh');

  state.content.innerHTML = html;

  // const firstElementChild = state.content.firstElementChild;
  // if (firstElementChild && firstElementChild.id !== 'highlights') {
  //   firstElementChild.remove();
  // }
  // state.content.insertAdjacentHTML('afterbegin', html);

  if (state.layout === 'flow') {
    state.wrapper.scrollTo({ left: 0, behavior: 'instant' });
  }
};

export default renderContent;
