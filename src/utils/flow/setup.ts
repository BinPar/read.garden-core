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
  const config = getConfig();

  if (state.layout !== 'flow' || config.layout !== 'flow') {
    return;
  }

  const chapterEnd = state.wrapper.querySelector('#chapter-end');

  if (!chapterEnd) {
    return;
  }

  const totalColumnWidth = state.columnWidth + state.columnGap;
  const wrapperLeft = state.wrapper.getBoundingClientRect().left;
  const wrapperScrollLeft = state.wrapper.scrollLeft;
  const scale = state.readMode ? 1 : config.uiModeScale;
  const chapterEndLeft = chapterEnd.getBoundingClientRect().left;

  const maxLeft =
    (chapterEndLeft - wrapperLeft) / scale +
    wrapperScrollLeft -
    state.columnGap / 2;

  state.snapsContainer.innerHTML = '';
  state.snaps.clear();

  let lastSnap = totalColumnWidth;
  let left = totalColumnWidth;
  const snapByLeft = new Map<number, HTMLDivElement>();
  while (left < maxLeft) {
    state.snaps.add(left);
    const snap = state.doc.createElement('div');
    snap.style.left = `${left}px`;
    snapByLeft.set(left, snap);
    state.snapsContainer.appendChild(snap);
    lastSnap = left;
    left += totalColumnWidth;
  }

  const addLabel = (label: string, left: number) => {
    const snap = snapByLeft.get(left);
    if (snap) {
      const labelContainer = state.doc.createElement('div');
      labelContainer.classList.add('page-label');
      labelContainer.textContent = label;
      snap.appendChild(labelContainer);
    }
  };

  const lefts = Array.from(snapByLeft.keys());
  let lastLabel = '';
  const labels = Array.from(
    state.content.querySelectorAll<HTMLSpanElement>('[data-page]'),
  );

  for (let i = 0, l = labels.length; i < l; i++) {
    const label = labels[i];
    if (label) {
      const page = label.dataset.page ?? '';
      const labelLeft =
        (label.getBoundingClientRect().left - wrapperLeft) / scale +
        totalColumnWidth;
      const snapLeft = lefts.find((snapLeft) => snapLeft < labelLeft);
      if (snapLeft) {
        const snapIndex = lefts.indexOf(snapLeft);
        if (snapIndex !== -1) {
          if (snapIndex !== 0) {
            for (let j = 0; j < snapIndex; j++) {
              const missingLeft = lefts[j];
              if (missingLeft) {
                addLabel(lastLabel, missingLeft);
              }
            }
          }
          addLabel(page, snapLeft);
          lefts.splice(0, snapIndex + 1);
        }
      }
      lastLabel = page;
    }
  }

  if (lefts.length && lastLabel) {
    for (let i = 0, l = lefts.length; i < l; i++) {
      const snapLeft = lefts[i];
      if (snapLeft) {
        addLabel(lastLabel, snapLeft);
      }
    }
  }

  state.wrapper.scrollTo({
    left: state.goToEnd ? lastSnap : totalColumnWidth,
    behavior: 'instant',
  });

  updateState(
    {
      firstSnap: totalColumnWidth,
      lastSnap,
      goToEnd: false,
    },
    true,
  );

  window.requestAnimationFrame(() => {
    setCssVariable('viewer-margin-top', '0');
  });
};

export const flowSetup = () => {
  console.log('Flow setup');
  window.requestAnimationFrame(() => {
    updateColumnNumber();
    window.requestAnimationFrame(() => {
      setupSnaps();
    });
  });
};

const setup = (state = getState()) => {
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
