import debounce from '@/tools/debounce';
import type {
  CommonConfig,
  FlowConfig,
  FlowOptionsOutput,
} from '@/types/config';

const charWidthFactor = 1.65;

const getColumnNumber = (config: FlowConfig) => {
  const { fontSize, maxColumns, minCharsPerColumn, maxCharsPerColumn } = config;

  if (maxColumns === 1) {
    return 1;
  }

  const { clientWidth } = document.body;
  const charWidth = fontSize / charWidthFactor;
  const minColumnWidth = minCharsPerColumn * charWidth;
  const maxColumnWidth = maxCharsPerColumn * charWidth;
  const maxColumnsByMinWidth = Math.floor(clientWidth / minColumnWidth);
  const maxColumnsByMaxWidth = Math.round(clientWidth / maxColumnWidth);
  const columnNumber = Math.max(
    1,
    Math.min(maxColumnsByMinWidth, maxColumnsByMaxWidth, maxColumns),
  );

  console.log({
    clientWidth,
    minColumnWidth,
    maxColumnWidth,
    maxColumnsByMinWidth,
    maxColumnsByMaxWidth,
  });

  console.log({
    columnNumber,
  });

  return columnNumber;
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

  const onResize = () => {
    getColumnNumber(config);
  };

  window.addEventListener('resize', debounce(onResize, 300));

  getColumnNumber(config);

  // TODO: Margins and paddings should be configurable

  return config;
};

export default setup;
