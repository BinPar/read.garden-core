import debounce from '@/tools/debounce';
import setCssVariable from '@/tools/setCssVariable';
import { getState, updateState } from '@/utils/state';
import { getConfig } from '@/utils/config';
import waitForRender from '@/utils/waitForRender';
import { addPropertyChangeListener } from '@/utils/state/propertyChangeListener';
import preloadFonts from '@/utils/flow/preloadFonts';
import setupSnaps from '@/utils/flow/setupSnaps';
import removeCssVariable from '@/tools/removeCssVariable';
import isWebKit from '@/tools/isWebKit';

const charWidthFactor = 1.65;

const updateColumnNumber = () => {
  const state = getState();
  const config = getConfig();

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

export const flowSetup = (checkColumns = false) => {
  if (checkColumns) {
    window.requestAnimationFrame(() => {
      updateColumnNumber();
      window.requestAnimationFrame(() => {
        setupSnaps();
      });
    });
  } else {
    window.requestAnimationFrame(() => {
      setupSnaps();
    });
  }
};

const setup = (checkColumns = false) => {
  const state = getState();

  if (state.layout !== 'flow') {
    return;
  }

  if (state.initialized) {
    waitForRender(() => flowSetup(checkColumns), isWebKit() ? 128 : 1);
    return;
  }

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
          isWebKit() ? 256 : 1,
        );
      };

      state.doc.head.appendChild(clone);
    }
  }

  window.addEventListener('resize', debounce(flowSetup, 500));

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

  addPropertyChangeListener('textAlign', ({ newValue }) => {
    setCssVariable('viewer-margin-top', '200svh');
    updateState({ previousContent: state.contentSlug }, true);
    if (newValue === null) {
      state.container.classList.remove('with-text-align');
      removeCssVariable('text-align');
    } else {
      state.container.classList.add('with-text-align');
      setCssVariable('text-align', newValue);
    }
    flowSetup();
  });

  addPropertyChangeListener('lineHeight', ({ newValue }) => {
    setCssVariable('viewer-margin-top', '200svh');
    updateState({ previousContent: state.contentSlug }, true);
    setCssVariable('line-height', `${newValue}`);
    flowSetup();
  });

  if (!state.loadingStyles) {
    flowSetup(true);
  }
};

export default setup;
