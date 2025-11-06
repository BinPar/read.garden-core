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
import dispatchEvent from '@/utils/events/dispatchEvent';
import setupSelectionMenu from '@/utils/setupSelectionMenu';
import getId from '@/tools/getId';
import hideSelectionMenu from '@/utils/hideSelectionMenu';
import hideMenuNote from '@/utils/hideNoteMenu';
import redrawHighlights from '@/utils/redrawHighlights';
import showNoteMenu from '@/utils/showNoteMenu';

const setup = (initialOptions: Options) => {
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

    link.onload = onFinish;
    link.onerror = (ex) => {
      console.error('Error loading content styles', ex);
      onFinish();
    };

    domElements.doc.head.appendChild(link);
  }

  domElements.container.classList.add(config.layout);
  domElements.container.classList.add(config.direction);
  domElements.container.classList.add(`${state.pageLayout}`);

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
    const mutatedContent = mutations.some(
      (mutation) =>
        mutation.target === state.content ||
        mutation.target === state.contentRight,
    );
    if (state.layout === 'flow' || mutatedContent) {
      window.requestAnimationFrame(() => {
        const onReady = () => {
          if (state.layout === 'flow') {
            flowSetup();
          }
          if (state.layout === 'fixed' && !state.loadingStyles) {
            fixedSetup();
          }

          const links = Array.from(state.content.querySelectorAll('a'));
          for (let i = 0, l = links.length; i < l; i++) {
            const link = links[i];
            if (link) {
              const id = `link-${getId()}`;
              link.dataset.link = id;
              link.onclick = (event) => {
                event.preventDefault();
                dispatchEvent({
                  type: 'onLinkClick',
                  url: link.getAttribute('href'),
                  querySelector: `[data-link="${id}"]`,
                });
              };
              // TODO: onLinkLoaded event
            }
          }
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

  // Observe right page in double layout
  if (state.content) {
    observer.observe(state.content, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }
  if (state.contentRight) {
    observer.observe(state.contentRight, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }

  loadContentBySlug(initialContentSlug);

  if (config.selectionMenuOptions?.length) {
    setupSelectionMenu(config.selectionMenuOptions);
  }

  render(initialOptions.ui, initialOptions.options?.isEReader);

  addPropertyChangeListener('contentSlug', () => {
    updateProgress();
  });

  addPropertyChangeListener('contentOrder', () => {
    redrawHighlights();
  });

  addPropertyChangeListener('progressMode', () => {
    updateProgress();
  });

  addPropertyChangeListener('theme', ({ oldValue, newValue }) => {
    state.container.classList.remove(oldValue);
    state.container.classList.add(newValue);
  });

  addPropertyChangeListener('currentHighlight', ({ newValue }) => {
    if (newValue) {
      showNoteMenu();
    } else {
      hideMenuNote();
    }
  });

  addPropertyChangeListener('currentSelection', ({ newValue }) => {
    if (newValue) {
      dispatchEvent({
        type: 'onUserSelect',
      });
    } else {
      hideSelectionMenu();
      if (!state.currentHighlight) {
        hideMenuNote();
      }
    }
  });

  addPropertyChangeListener('clickedHighlight', ({ newValue }) => {
    if (newValue === null && !state.currentSelection) {
      hideSelectionMenu();
    }
  });

  addPropertyChangeListener('clickedNoteHighlight', ({ newValue }) => {
    if (newValue) {
      showNoteMenu('show');
    } else {
      hideMenuNote();
    }
  });

  return {
    state,
    config,
    dispatch,
  };
};

export default setup;
