import debounce from '@/tools/debounce';
import setCssVariable from '@/tools/setCssVariable';
import { getState, updateState } from '@/utils/state';
import { getConfig } from '@/utils/config';
import genericCatch from '@/tools/genericCatch';
import waitForRender from '@/utils/waitForRender';

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

  const { container } = state;

  const containerRect = container.getBoundingClientRect();
  const containerWidth = Math.floor(containerRect.width);

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
    const columnCount = Math.min(
      absoluteMaxColumns,
      doubleColumnWidth < minColumnWidth ? 1 : 2,
    );
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
    setCssVariable('column-rule-width', `${columnCount > 1 ? 1 : 0}px`);

    updateState({
      columnWidth,
      columnGap,
      columnCount,
    });
  }
};

export const setupSnaps = () => {
  const state = getState();
  if (state.layout !== 'flow') {
    return;
  }

  const totalColumnWidth = state.columnWidth + state.columnGap;
  const chapterEnd = state.wrapper.querySelector('#chapter-end');

  if (!chapterEnd) {
    return;
  }

  const width =
    chapterEnd.getBoundingClientRect().left +
    state.wrapper.scrollLeft -
    state.columnGap;

  state.snapsContainer.innerHTML = '';
  state.snaps.clear();

  const labels = Array.from(
    state.content.querySelectorAll<HTMLSpanElement>('[data-page]'),
  );

  let lastPage = '';

  let lastSnap = totalColumnWidth;
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
    lastSnap = left;
    left += totalColumnWidth;
  }

  console.log({
    labels,
    totalColumnWidth,
    width,
    left: state.wrapper.scrollLeft,
  });

  state.wrapper.scrollTo({
    left: state.goToEnd ? lastSnap : totalColumnWidth,
    behavior: 'instant',
  });

  updateState({
    firstSnap: totalColumnWidth,
    lastSnap,
    goToEnd: false,
  });

  window.requestAnimationFrame(() => {
    setCssVariable('viewer-margin-top', '0');
  });
};

export const flowSetup = () => {
  console.log('flow setup');
  window.requestAnimationFrame(() => {
    updateColumnNumber();
    window.requestAnimationFrame(() => {
      setupSnaps();
    });
  });
};

const setup = (state = getState()) => {
  console.log('flow init', state, state.loadingStyles, [
    ...Array.from(state.doc.styleSheets),
  ]);

  const fontsStyles =
    window.parent.parent.document.querySelector<HTMLStyleElement>('#fonts-css');

  const onFinish = () => {
    console.log(`Finish flow init`);
    waitForRender(() => {
      updateState((current) => {
        if (current.coreCssLoaded && current.contentCssLoaded) {
          return {
            fontsCssLoaded: true,
            initialized: true,
            loadingStyles: false,
          };
        }
        return { fontsCssLoaded: true, initialized: true };
      });
    });
  };

  if (fontsStyles) {
    const config = getConfig();
    const clone = fontsStyles.cloneNode(true) as HTMLStyleElement;
    clone.onload = () => {
      waitForRender(
        () => {
          if (config.layout === 'flow') {
            const styleSheet = Array.from(state.doc.styleSheets).find(
              (item) => (item.ownerNode as HTMLElement).id === clone.id,
            );

            if (styleSheet?.ownerNode?.textContent) {
              const fonts = Array.from(
                styleSheet.ownerNode.textContent.matchAll(
                  new RegExp(
                    `font-family:\\s?'${config.fontFamily}'[^\\(]+\\('([^']+)`,
                    'g',
                  ),
                ),
              );

              console.log(`Loading ${fonts.length} fonts`);

              Promise.all(
                fonts.map(
                  (fontMatch) =>
                    new Promise((resolve) => {
                      const [, url] = fontMatch;
                      if (url) {
                        const link = state.doc.createElement('link');
                        link.onload = resolve;
                        link.onerror = resolve;
                        link.rel = 'preload';
                        link.href = url;
                        link.as = 'font';
                        link.crossOrigin = 'anonymous';
                        state.doc.head.appendChild(link);
                      }
                    }),
                ),
              )
                .then(onFinish)
                .catch(genericCatch('Exception while loading fonts'));
              return;
            }
          }
          onFinish();
        },
        state.isSafari ? 256 : 1,
      );
    };
    state.doc.head.appendChild(clone);
  }

  window.addEventListener('resize', debounce(flowSetup, 300));

  if (!state.loadingStyles) {
    flowSetup();
  }
};

export default setup;
