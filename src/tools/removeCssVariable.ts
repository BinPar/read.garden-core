import type { CssVariableKey } from '@/@types/common';
import { getState } from '@/utils/state';

const removeCssVariable = (variable: CssVariableKey) => {
  const { doc } = getState();
  doc.documentElement.style.removeProperty(`--${variable}`);
};

export default removeCssVariable;
