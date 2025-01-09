import type { CssVariableKey } from '@/@types';
import { getState } from '@/utils/state';

const setCssVariable = (variable: CssVariableKey, value: string | null) => {
  const { doc } = getState();
  doc.documentElement.style.setProperty(`--${variable}`, value);
};

export default setCssVariable;
