import debounce from '@/tools/debounce';
import setCssVariable from '@/tools/setCssVariable';
import { getState, updateState } from '@/utils/state';
import { getConfig } from '@/utils/config';
import waitForRender from '@/utils/waitForRender';
import { addPropertyChangeListener } from '@/utils/state/propertyChangeListener';
import preloadFonts from '@/utils/flow/preloadFonts';
import updateProgress from '@/utils/updateProgress';

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

  const totalColumnWidth = state.columnWidth + state.columnGap;
  const wrapperLeft = state.wrapper.getBoundingClientRect().left;
  const wrapperScrollLeft = state.wrapper.scrollLeft;
  const scale = state.readMode ? 1 : config.uiModeScale;
  const chapterEndLeft = state.chapterEnd.getBoundingClientRect().left;

  const maxLeft =
    Math.floor(
      ((chapterEndLeft - wrapperLeft) / scale +
        wrapperScrollLeft -
        state.columnGap / 2) /
        totalColumnWidth,
    ) * totalColumnWidth;

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

  const contentBySnap = new Map<number, string>();
  const snapByContent = new Map<string, number>();

  const addLabel = (label: string, left: number) => {
    const snap = snapByLeft.get(left);
    if (snap) {
      const labelContainer = state.doc.createElement('div');
      labelContainer.classList.add('page-label');
      labelContainer.textContent = label;
      snap.appendChild(labelContainer);
      contentBySnap.set(left, label);
    }
  };

  const lefts = Array.from(snapByLeft.keys());
  const labels = Array.from(
    state.content.querySelectorAll<HTMLSpanElement>('[data-page]'),
  );
  let lastLabel = '';

  let currentLeft = lefts.shift();

  for (let i = 0, l = labels.length; i < l; i++) {
    const label = labels[i];
    if (label && currentLeft) {
      const page = label.dataset.page ?? '';
      const labelRectLeft = label.getBoundingClientRect().left;

      const labelLeft =
        (labelRectLeft - wrapperLeft) / scale +
        totalColumnWidth +
        Math.max(wrapperScrollLeft - totalColumnWidth, 0);
      const labelSnap =
        Math.round(labelLeft / totalColumnWidth) * totalColumnWidth;
      snapByContent.set(page, currentLeft);

      while (currentLeft && currentLeft < labelSnap) {
        addLabel(lastLabel, currentLeft);
        currentLeft = lefts.shift();
      }

      if (currentLeft) {
        do {
          addLabel(page, currentLeft);
          currentLeft = lefts.shift();
        } while (currentLeft && currentLeft < labelSnap);
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

  const previousContent = state.previousContent
    ? snapByContent.get(state.previousContent)
    : null;

  const contentSlug = state.goToEnd
    ? lastLabel
    : (state.previousContent ?? state.contentSlug);

  const scrollLeft = state.goToEnd
    ? lastSnap
    : (previousContent ?? totalColumnWidth);

  updateState(
    {
      firstSnap: totalColumnWidth,
      lastSnap,
      snapByContent,
      contentBySnap,
      contentSlug,
      goToEnd: false,
      previousContent: null,
    },
    true,
  );

  setCssVariable('overflow-x', 'hidden');
  setCssVariable('scroll-behavior', 'auto');
  setCssVariable('scroll-snap-type', 'none');

  window.requestAnimationFrame(() => {
    state.wrapper.scrollLeft = scrollLeft;
    window.requestAnimationFrame(() => {
      setCssVariable('viewer-margin-top', '0');
      window.requestAnimationFrame(() => {
        setCssVariable('overflow-x', 'auto');
        setCssVariable('scroll-behavior', 'smooth');
        setCssVariable('scroll-snap-type', 'x mandatory');
        updateProgress();
      });
    });
  });
};

export const flowSetup = () => {
  window.requestAnimationFrame(() => {
    updateColumnNumber();
    window.requestAnimationFrame(() => {
      setupSnaps();
    });
  });
};

const setup = (state = getState()) => {
  // TODO: Selector (#fonts-css) in config
  const fontsStyles =
    window.parent.parent.document.querySelector<HTMLStyleElement>('#fonts-css');

  // TODO: what if fontsStyles is null?
  if (fontsStyles) {
    const config = getConfig();
    if (config.layout === 'flow') {
      const onFinish = () => {
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
        // TODO: Config option to preload, right now it's quite fast without it
        // preloadFonts();
      };

      const clone = fontsStyles.cloneNode(true) as HTMLStyleElement;
      clone.onload = () => {
        waitForRender(
          () => {
            if (config.layout === 'flow' && state.layout === 'flow') {
              const styleSheet = Array.from(state.doc.styleSheets).find(
                (item) => (item.ownerNode as HTMLElement).id === clone.id,
              );

              if (styleSheet?.ownerNode?.textContent) {
                const allFonts = Array.from(
                  styleSheet.ownerNode.textContent.matchAll(
                    new RegExp(`font-family:\\s?'(.+)'[^\\(]+\\('([^']+)`, 'g'),
                  ),
                );

                for (let i = 0, l = allFonts.length; i < l; i++) {
                  const match = allFonts[i];
                  if (match) {
                    const [, fontFamily, url] = match;
                    if (fontFamily && url) {
                      let fontUrls = state.fontsUrls.get(fontFamily);
                      if (!fontUrls) {
                        fontUrls = new Array<string>();
                        state.fontsUrls.set(fontFamily, fontUrls);
                      }
                      fontUrls.push(url);
                    }
                  }
                }

                preloadFonts(config.fontFamily, onFinish);
              }
            }
            onFinish();
          },
          state.isSafari ? 256 : 1,
        );
      };

      state.doc.head.appendChild(clone);
    }
  }

  window.addEventListener('resize', debounce(flowSetup, 300));

  if (!state.loadingStyles) {
    flowSetup();
  }

  addPropertyChangeListener('fontSize', ({ newValue }) => {
    setCssVariable('viewer-margin-top', '200svh');
    updateState({ previousContent: state.contentSlug }, true);
    setCssVariable('font-size', `${newValue}px`);
    flowSetup();
  });

  addPropertyChangeListener('fontFamily', ({ newValue }) => {
    setCssVariable('viewer-margin-top', '200svh');
    preloadFonts(newValue, () => {
      updateState({ previousContent: state.contentSlug }, true);
      setCssVariable('font-family', newValue);
      flowSetup();
    });
  });
};

export default setup;
