import type { ActionHandler, IncreaseFontSize } from '@/@types/actions';
import increaseFont from '@/utils/flow/increaseFont';

const increaseFontSize: ActionHandler<IncreaseFontSize> = () => {
  increaseFont();
};

export default increaseFontSize;
