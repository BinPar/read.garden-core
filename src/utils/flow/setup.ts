import debounce from '@/tools/debounce';
import setCssVariable from '@/tools/setCssVariable';
import { getState, updateState } from '@/utils/state';
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
    const columnCount = doubleColumnWidth < minColumnWidth ? 1 : 2;
    const totalColumnWidth = containerWidth / columnCount;
    const columnGap = Math.max(
      config.columnGap,
      totalColumnWidth - maxColumnWidth,
    );
    const columnWidth = totalColumnWidth - columnGap;

    console.log({
      containerWidth,
      minColumnWidth,
      maxColumnWidth,
      columnCount,
      columnGap,
      columnWidth,
    });

    setCssVariable('column-count', `${columnCount}`);
    setCssVariable('column-width', `${columnWidth}px`);
    setCssVariable('column-gap', `${columnGap}px`);

    updateState({
      columnWidth,
      columnGap,
      columnCount,
    });
  }
};

const setupSnaps = (state = getState()) => {
  if (state.layout !== 'flow') {
    return;
  }

  const totalColumnWidth = state.columnWidth + state.columnGap;
  const { width } = state.content.getBoundingClientRect();

  state.snapsContainer.innerHTML = '';
  state.snaps.clear();

  let left = totalColumnWidth;
  while (left < width) {
    state.snaps.add(left);
    const snap = state.doc.createElement('div');
    snap.style.left = `${left}px`;
    state.snapsContainer.appendChild(snap);
    left += totalColumnWidth;
  }

  state.wrapper.scrollLeft = totalColumnWidth;
};

const setupPageLabels = (state = getState()) => {
  if (state.layout !== 'flow') {
    return;
  }

  state.pageLabelsContainer.innerHTML = '';

  const snaps = new Map<number, string>();

  state.content
    .querySelectorAll<HTMLSpanElement>('[data-page]')
    .forEach((element) => {
      const rect = element.getBoundingClientRect();
      const page = element.dataset.page;
      const snap = rect.left - state.columnGap / 2;
      console.log({ snap, page, left: rect.left });
      if (page) {
        if (!snaps.has(snap)) {
          const label = state.doc.createElement('div');
          label.classList.add('page-label');
          label.style.left = `${snap}px`;
          label.textContent = page;
          state.pageLabelsContainer.appendChild(label);
        }
        snaps.set(snap, page);
      }
    });

  // TODO: Check columns with missing label (missing snaps)
  // let lastPage = '';
  // state.snaps.forEach((snap) => {
  // });
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
  setupSnaps();
  setupPageLabels();

  // TODO: Margins and paddings should be configurable

  return config;
};

export default setup;
