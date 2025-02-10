import type { ActionHandler, ShowSelectionMenu } from '@/@types/actions';
import showSelectionMenu from '@/utils/showSelectionMenu';

const showSelectionMenuHandler: ActionHandler<ShowSelectionMenu> = ({ action }) => {
  showSelectionMenu(action.options, action.id, action.deleteOption);
};

export default showSelectionMenuHandler;
