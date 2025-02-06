import type { ActionHandler, SetTheme } from '@/@types/actions';
import updateTheme from '@/utils/updateTheme';

const setTheme: ActionHandler<SetTheme> = ({ action }) => {
  updateTheme(action.theme);
};

export default setTheme;
