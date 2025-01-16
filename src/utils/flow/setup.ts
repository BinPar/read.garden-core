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
    minColumnGap,
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
    containerWidth - minColumnGap,
  );
  const maxColumnWidth = Math.min(
    maxCharsPerColumn * charWidth + desiredColumnGap,
    containerWidth - minColumnGap,
  );

  if (config.direction === 'horizontal') {
    const doubleColumnWidth = containerWidth / 2 - desiredColumnGap;
    const columnCount = doubleColumnWidth < minColumnWidth ? 1 : 2;
    const totalColumnWidth = containerWidth / columnCount;
    const columnGap = Math.min(
      containerWidth - minColumnWidth,
      Math.max(config.columnGap, totalColumnWidth - maxColumnWidth),
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

export const flowSetup = () => {
  updateColumnNumber();
  setupSnaps();
  setupPageLabels();
};

const setup = (state = getState()) => {
  console.log('flow init', state, state.loadingStyles, [
    ...Array.from(state.doc.styleSheets),
  ]);

  // TODO: Improve fonts CSS setup

  const fontsStyles =
    window.parent.parent.document.querySelector<HTMLStyleElement>('#fonts-css');

  if (fontsStyles) {
    const clone = fontsStyles.cloneNode(true);
    (clone as HTMLStyleElement).onload = () => {
      console.log('fonts loaded');
      updateState((current) => {
        if (current.coreCssLoaded && current.contentCssLoaded) {
          return { fontsCssLoaded: true, loadingStyles: false };
        }
        return { fontsCssLoaded: true };
      });
    };
    state.doc.head.appendChild(clone);
  }

  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'user-scalable=0, width=device-width, initial-scale=1';

  window.parent.parent.document.head.appendChild(meta);
  state.doc.head.appendChild(meta.cloneNode(true));

  window.addEventListener('resize', debounce(flowSetup, 300));

  if (!state.loadingStyles) {
    flowSetup();
  }

  // TODO: Margins and paddings should be configurable
};

export default setup;
