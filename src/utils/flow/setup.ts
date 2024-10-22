import debounce from '@/tools/debounce';
import setCssVariable from '@/tools/setCssVariable';
import type {
  CommonConfig,
  FlowConfig,
  FlowOptionsOutput,
} from '@/types/config';

const charWidthFactor = 1.65;

const updateColumnNumber = (config: FlowConfig) => {
  const {
    fontSize,
    maxColumns: absoluteMaxColumns,
    minCharsPerColumn,
    maxCharsPerColumn,
  } = config;

  if (absoluteMaxColumns === 1) {
    return 1;
  }

  const { clientWidth } = document.body;
  const charWidth = fontSize / charWidthFactor;
  const minColumnWidth = minCharsPerColumn * charWidth;
  const maxColumnWidth = maxCharsPerColumn * charWidth;
  const minColumns = Math.floor(clientWidth / maxColumnWidth);
  const maxColumns = Math.floor(clientWidth / minColumnWidth);
  // const maxColumnsByMinWidth = Math.floor(clientWidth / minColumnWidth);
  // const maxColumnsByMaxWidth = Math.round(clientWidth / maxColumnWidth);
  const columnNumber = Math.max(
    1,
    minColumns,
    Math.min(maxColumns, absoluteMaxColumns),
  );

  console.log({
    clientWidth,
    minColumnWidth,
    maxColumnWidth,
    absoluteMaxColumns,
    minColumns,
    maxColumns,
  });

  const gap = 32;
  const columnWidth =
    (clientWidth - gap - gap * (columnNumber - 1)) / columnNumber;

  console.log({
    columnNumber,
    columnWidth,
  });

  setCssVariable('column-count', `${columnNumber}`);
  setCssVariable('column-width', `${columnWidth}px`);
  setCssVariable('column-gap', `${gap}px`);
};

const setup = (
  flowOptions: FlowOptionsOutput,
): FlowConfig & Partial<CommonConfig> => {
  const { fontSize, maxColumns, minCharsPerColumn, maxCharsPerColumn } =
    flowOptions;

  const config: FlowConfig & Partial<CommonConfig> = {
    fontSize,
    maxColumns,
    minCharsPerColumn,
    maxCharsPerColumn,
  };

  console.log('flow setup');

  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'user-scalable=0';

  document.head.appendChild(meta);
  window.parent.parent.document.head.appendChild(meta);

  if (maxColumns > 1) {
    window.addEventListener(
      'resize',
      debounce(() => {
        updateColumnNumber(config);
      }, 300),
    );
  }

  updateColumnNumber(config);

  // TODO: Margins and paddings should be configurable

  return config;
};

export default setup;
