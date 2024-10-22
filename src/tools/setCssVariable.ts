import type { CssVariableKey } from '@/types';

const setCssVariable = (variable: CssVariableKey, value: string | null) => {
  document.documentElement.style.setProperty(`--${variable}`, value);
};

export default setCssVariable;
