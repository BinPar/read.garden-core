import getSelection from '@/utils/getSelection';
import { updateState } from '@/utils/state';

const clearSelection = () => {
  const selection = getSelection();
  selection.empty();
  updateState({
    currentSelection: null,
  });
};

export default clearSelection;
