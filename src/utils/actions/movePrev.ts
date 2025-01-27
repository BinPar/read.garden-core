import type { ActionHandler, MovePrev } from '@/@types/actions';
import moveBackwards from '@/utils/moveBackwards';

const movePrev: ActionHandler<MovePrev> = () => {
  moveBackwards();
};

export default movePrev;
