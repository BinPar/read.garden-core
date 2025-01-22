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

  const labels = Array.from(
    state.content.querySelectorAll<HTMLSpanElement>('[data-page]'),
  );

  let lastPage = '';

  let left = totalColumnWidth;
  while (left < width) {
    state.snaps.add(left);
    const snap = state.doc.createElement('div');
    snap.style.left = `${left}px`;
    state.snapsContainer.appendChild(snap);
    if (lastPage) {
      const firstLabel = labels.shift();
      if (firstLabel) {
        const page = firstLabel.dataset.page ?? '';
        const label = state.doc.createElement('div');
        label.classList.add('page-label');
        label.textContent = page;
        snap.appendChild(label);
        lastPage = page;
      }
    } else {
      const labelIndex = labels.findIndex(
        (el) => el.getBoundingClientRect().left >= left,
      );
      const label = labelIndex >= 0 ? labels[labelIndex] : undefined;
      const page = label?.dataset.page ?? lastPage;
      if (page) {
        const label = state.doc.createElement('div');
        label.classList.add('page-label');
        label.textContent = page;
        snap.appendChild(label);
        lastPage = page;
      }
    }
    left += totalColumnWidth;
  }

  state.wrapper.scrollLeft = totalColumnWidth;
};

export const flowSetup = () => {
  updateColumnNumber();
  setupSnaps();
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

  window.addEventListener('resize', debounce(flowSetup, 300));

  if (!state.loadingStyles) {
    flowSetup();
  }

  // TODO: Margins and paddings should be configurable
};

export default setup;
