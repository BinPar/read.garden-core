import type { ActionHandler, AddOnChangeEvent } from '@/@types/actions';
import { addPropertyChangeListener } from '@/utils/state/propertyChangeListener';

const addOnChangeEvent: ActionHandler<AddOnChangeEvent> = ({ action }) => {
  addPropertyChangeListener(action.propertyName, action.event);
};

export default addOnChangeEvent;
