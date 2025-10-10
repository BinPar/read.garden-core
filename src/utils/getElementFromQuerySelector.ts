import { getState } from '@/utils/state';

const getElementFromQuerySelector = (selector: string): Node | null => {
  if (selector.endsWith('}')) {
    const start = selector.lastIndexOf('{') + 1;
    const numberText = selector.substring(start, selector.length - 1);
    let nthChild = parseInt(numberText, 10);
    const parentExpression = selector.substring(0, start - 1);
    const parent = getElementFromQuerySelector(parentExpression);
    if (parent) {
      if (nthChild >= parent.childNodes.length) {
        nthChild = parent.childNodes.length - 1;
      }
      return parent.childNodes[nthChild] as Node;
    }
    return null;
  }
  const state = getState();
  // First try within left content
  const inLeft = state.content.querySelector(selector);
  if (inLeft) {
    return inLeft;
  }
  // If double-page layout, also search within right content
  if (state.contentRight) {
    const inRight = state.contentRight.querySelector(selector);
    if (inRight) {
      return inRight;
    }
  }
  return null;
};

export default getElementFromQuerySelector;
