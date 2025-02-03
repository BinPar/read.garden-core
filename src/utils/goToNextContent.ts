import genericCatch from '@/tools/genericCatch';
import loadContent from '@/utils/loadContent';
import { getState } from '@/utils/state';

const goToNextContent = () => {
  const state = getState();
  const content = state.orderedContents?.[state.contentOrder];
  if (content?.next) {
    loadContent(content.next).catch(
      genericCatch('Exception loading next chapter'),
    );
  }
};

export default goToNextContent;
