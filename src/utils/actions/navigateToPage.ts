import type { ActionHandler, NavigateToPage } from '@/@types/actions';
import navigateToContentSlug from '@/utils/navigateToContentSlug';

const navigateToPage: ActionHandler<NavigateToPage> = ({ action }) => {
  navigateToContentSlug(action.contentSlug);
};

export default navigateToPage;
