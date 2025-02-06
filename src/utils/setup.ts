import { type Options } from '@/@types/config';

import render from '@/utils/buttons/render';
import setupDomEvents from '@/utils/setupDomEvents';
import setupDomElements from '@/utils/setupDomElements';
import { getState, init as initState, updateState } from '@/utils/state';
import { getConfig, init as initConfig } from '@/utils/config';
import setupCssVars from '@/utils/setupCssVars';
import loadContentBySlug from '@/utils/loadContentBySlug';
import genericCatch from '@/tools/genericCatch';
import flowSetup from '@/utils/flow/setup';
import fixedSetup from '@/utils/fixed/setup';
import setupFixedEvents from '@/utils/fixed/setupEvents';
import setupFlowEvents from '@/utils/flow/setupEvents';
import { addPropertyChangeListener } from '@/utils/state/propertyChangeListener';
import dispatch from '@/utils/dispatch';
import updateProgress from '@/utils/updateProgress';
import { defaultCommonConfig } from '@/utils/defaults';

const setup = (initialOptions: Options) => {
  console.log('setup', initialOptions);

  const domElements = setupDomElements(initialOptions);
  initConfig(initialOptions);
  initState(initialOptions, domElements);

  const config = getConfig();
  const state = getState();

  state.container.classList.add(state.theme);

  if (initialOptions.jsonData?.cssURL && initialOptions.baseUrl) {
    const link = domElements.doc.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `${initialOptions.baseUrl}/${initialOptions.jsonData.cssURL}`;
    const onFinish = () => {
      updateState((current) => {
        if (
          current.coreCssLoaded &&
          (current.layout === 'fixed' || current.fontsCssLoaded)
        ) {
          return { contentCssLoaded: true, loadingStyles: false };
        }
        return { contentCssLoaded: true };
      });
    };

    link.onload = () => {
      console.log('content styles loaded');
      onFinish();
    };
    link.onerror = (ex) => {
      console.error('Error loading content styles', ex);
      onFinish();
    };

    domElements.doc.head.appendChild(link);
  }

  domElements.container.classList.add(config.layout);
  domElements.container.classList.add(config.direction);

  if (config.layout === 'fixed' && config.paginated) {
    domElements.container.classList.add('paginated');
  }

  domElements.doc.documentElement.setAttribute(
    'lang',
    config.lang ?? defaultCommonConfig.lang,
  );

  setupCssVars();
  setupDomEvents();

  if (config.layout === 'fixed') {
    setupFixedEvents();
  }

  if (config.layout === 'flow') {
    setupFlowEvents();
  }

  let initialContentSlug = initialOptions.options.initialContentSlug;
  if (initialOptions.jsonData) {
    if (!initialContentSlug) {
      initialContentSlug = initialOptions.jsonData.initialContentSlug;
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
          if (state.layout === 'flow') {
            flowSetup();
          }
          if (state.layout === 'fixed') {
            fixedSetup();
          }

          const links = state.content.querySelectorAll('a');
          // TODO: links events (loaded and clicked)
          links.forEach((link) => {
            link.onclick = (event) => {
              event.preventDefault();
            };
          });
        };

        if (state.layout === 'fixed') {
          onReady();
          return;
        }

        const images = Array.from(state.wrapper.querySelectorAll('img'));
        if (!images.length) {
          onReady();
          return;
        }

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
      });
    }
  });

  observer.observe(state.content, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  loadContentBySlug(initialContentSlug);
  render(initialOptions.ui);

  addPropertyChangeListener('contentSlug', () => {
    updateProgress();
  });

  addPropertyChangeListener('contentOrder', ({ oldValue, newValue }) => {
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

  addPropertyChangeListener('progressMode', () => {
    updateProgress();
  });

  addPropertyChangeListener('theme', ({ oldValue, newValue }) => {
    state.container.classList.remove(oldValue);
    state.container.classList.add(newValue);
  });

  return {
    state,
    config,
    dispatch,
  };
};

export default setup;
