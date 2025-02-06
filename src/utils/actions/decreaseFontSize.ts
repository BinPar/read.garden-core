import type { ActionHandler, DecreaseFontSize } from '@/@types/actions';
import decreaseFont from '@/utils/flow/decreaseFont';

const decreaseFontSize: ActionHandler<DecreaseFontSize> = () => {
  decreaseFont();
};

export default decreaseFontSize;
