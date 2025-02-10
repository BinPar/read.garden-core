const getNodeQuerySelector = (node: Range['startContainer']): string => {
  const element = node as HTMLElement;

  if (element.dataset?.id) {
    return `${element.tagName.toLowerCase()}[data-id="${element.dataset.id}"]`;
  }

  if (element.id) {
    return `#${element.id}`;
  }

  if (node.parentNode) {
    const parentQuerySelector = getNodeQuerySelector(node.parentNode);
    let childIndex = 0;
    let child: Node | null = node;

    while (child.previousSibling) {
      child = child.previousSibling;
      childIndex++;
    }

    return `${parentQuerySelector}{${childIndex}}`;
  }

  throw new Error('Can not find Query Selection from node');
};

export default getNodeQuerySelector;
