import debounce from '@/tools/debounce';
import setCssVariable from '@/tools/setCssVariable';
import { getState } from '@/utils/state';
import { getConfig } from '@/utils/config';

const charWidthFactor = 1.65;

const updateColumnNumber = (state = getState(), config = getConfig()) => {
  if (config.layout !== 'flow' || state.layout !== 'flow') {
    return;
  }

  const {
    fontSize,
    maxColumns: absoluteMaxColumns,
    minCharsPerColumn,
    maxCharsPerColumn,
    columnGap: desiredColumnGap,
  } = config;

  if (absoluteMaxColumns === 1) {
    return 1;
  }

  const { container } = state;

  const containerRect = container.getBoundingClientRect();
  const containerWidth = Math.floor(containerRect.width);
  // const containerHeight = Math.floor(containerRect.height);

  const charWidth = fontSize / charWidthFactor;
  const minColumnWidth = Math.min(
    minCharsPerColumn * charWidth,
    containerWidth,
  );
  const maxColumnWidth = Math.min(
    maxCharsPerColumn * charWidth + desiredColumnGap,
    containerWidth,
  );

  if (config.direction === 'horizontal') {
    const doubleColumnWidth = containerWidth / 2 - desiredColumnGap;
    const columnsInViewport = doubleColumnWidth < minColumnWidth ? 1 : 2;
    const totalColumnWidth = containerWidth / columnsInViewport;
    const columnGap = Math.max(config.columnGap, totalColumnWidth - maxColumnWidth);
    const columnWidth = totalColumnWidth - columnGap;
  
    console.log({
      containerWidth,
      minColumnWidth,
      maxColumnWidth,
      columnsInViewport,
      columnGap,
      columnWidth,
    });
  
    setCssVariable('column-count', `${columnsInViewport}`);
    setCssVariable('column-width', `${columnWidth}px`);
    setCssVariable('column-gap', `${columnGap}px`);

  }
};

const setup = (state = getState(), config = getConfig()) => {
  console.log('flow setup', state);

  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'user-scalable=0';

  document.head.appendChild(meta);
  window.parent.parent.document.head.appendChild(meta);

  window.addEventListener(
    'resize',
    debounce(() => {
      updateColumnNumber();
    }, 300),
  );

  updateColumnNumber();

  // TODO: Margins and paddings should be configurable

  return config;
};

export default setup;
