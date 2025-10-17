import type { ActionHandler, SetPageLayout } from '@/@types/actions';
import setPageLayout from '@/utils/setPageLayout';

const setPageLayoutAction: ActionHandler<SetPageLayout> = ({ action }) => {
  setPageLayout(action.pageLayout);
};

export default setPageLayoutAction;
