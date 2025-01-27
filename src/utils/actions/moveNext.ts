import type { ActionHandler, MoveNext } from '@/@types/actions';
import moveForward from '@/utils/moveForward';

const moveNext: ActionHandler<MoveNext> = () => {
  moveForward();
};

export default moveNext;
