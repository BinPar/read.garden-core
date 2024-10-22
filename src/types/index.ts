declare global {
  interface Window {
    test: () => void;
  }
}

export type CssVariableKey = 'column-count' | 'column-gap' | 'column-width';