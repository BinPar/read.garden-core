import { type Options } from '@/@types/config';

import render from '@/utils/buttons/render';
import setupDomEvents from '@/utils/setupDomEvents';
import setupDomElements from '@/utils/setupDomElements';
import { getState, init as initState, updateState } from '@/utils/state';
import { getConfig, init as initConfig } from '@/utils/config';
import setupCssVars from '@/utils/setupCssVars';
import { defaultState } from '@/utils/defaults';
import loadContentBySlug from '@/utils/loadContentBySlug';
import genericCatch from '@/tools/genericCatch';
import flowInit, { setupSnaps } from '@/utils/flow/setup';
import fixedInit, { fixedSetup } from '@/utils/fixed/setup';
import setupFixedEvents from '@/utils/fixed/setupEvents';
import waitForRender from '@/utils/waitForRender';
import { addPropertyChangeListener } from '@/utils/state/propertyChangeListener';

const setup = (initialOptions: Options) => {
  console.log('setup', initialOptions);

  const readMode = initialOptions.options.readMode ?? defaultState.readMode;

  const domElements = setupDomElements(initialOptions);
  initConfig(initialOptions);
  initState(initialOptions, { readMode, ...domElements });

  const config = getConfig();
  const state = getState();

  domElements.container.classList.add(config.layout);
  domElements.container.classList.add(config.direction);

  if (config.layout === 'fixed' && config.paginated) {
    domElements.container.classList.add('paginated');
  }

  setupCssVars();
  setupDomEvents();

  if (config.layout === 'fixed') {
    // setupFixedVars();
    setupFixedEvents();
  }

  // if (config.layout === 'flow') {
  //   setupFlowVars();
  //   setupFlowEvents();
  // }

  let initialContentSlug = initialOptions.options.initialContentSlug;
  if (initialOptions.options.jsonData) {
    if (!initialContentSlug) {
      initialContentSlug = initialOptions.options.jsonData.initialContentSlug;
    }
  }

  if (!initialContentSlug) {
    console.warn('Missing initial content slug, assuming "1"');
    initialContentSlug = '1';
  }

  const observer = new MutationObserver((mutations) => {
    if (
      state.layout === 'flow' ||
      mutations.some((mutation) => mutation.target === state.content)
    ) {
      window.requestAnimationFrame(() => {
        const onReady = () => {
          if (state.initialized) {
            if (state.layout === 'flow') {
              waitForRender(setupSnaps, state.isSafari ? 128 : 1);
            }
            if (state.layout === 'fixed') {
              fixedSetup();
            }
          } else {
            if (state.layout === 'flow') {
              console.log('setup');
              flowInit();
            }
            if (state.layout === 'fixed') {
              fixedInit();
            }
          }
          const links = state.content.querySelectorAll('a');
          links.forEach((link) => {
            link.onclick = (event) => {
              event.preventDefault();
            };
          });
        };

        if (state.layout === 'fixed') {
          onReady();
        } else {
          const images = Array.from(state.wrapper.querySelectorAll('img'));

          if (images.length) {
            Promise.all(
              images.map(
                (image) =>
                  new Promise<void>((resolve) => {
                    const imageReady = () => {
                      const ratio = image.naturalWidth / image.naturalHeight;
                      const style = image.getAttribute('style') ?? '';
                      const rules = style.split(';').map((rule) => rule.trim());
                      rules.push(`--aspect-ratio: ${ratio}`);
                      image.setAttribute('style', rules.join(';'));
                      resolve();
                    };

                    if (image.complete) {
                      imageReady();
                    } else {
                      image.onload = () => imageReady();
                      image.onerror = () => imageReady();
                    }
                  }),
              ),
            )
              .then(onReady)
              .catch(genericCatch('Error loading images'));
          } else {
            onReady();
          }
        }
      });
    }
  });

  observer.observe(state.content, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  loadContentBySlug(initialContentSlug).catch(
    genericCatch('Exception loading first content'),
  );

  if (initialOptions.ui?.buttons?.length) {
    render(initialOptions.ui.buttons, state);
  }

  addPropertyChangeListener('contentOrder', ({ oldValue, newValue }) => {
    console.log('contentOrder changed');
    state.highlightsLayers.set(
      oldValue,
      state.highlights.cloneNode(true) as HTMLDivElement,
    );
    let highlightsLayer = state.highlightsLayers.get(newValue);
    if (!highlightsLayer) {
      highlightsLayer = state.doc.createElement('div');
      highlightsLayer.id = 'highlights';
      state.highlightsLayers.set(newValue, highlightsLayer);
    }
    if (state.layout === 'fixed') {
      state.content.appendChild(highlightsLayer);
    }
    if (state.layout === 'flow') {
      state.highlights.remove();
      state.wrapper.appendChild(highlightsLayer);
    }
    updateState({ highlights: highlightsLayer });
  });

  return {
    state,
    config,
  };
};

export default setup;
