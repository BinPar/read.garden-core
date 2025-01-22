import { type Options } from '@/@types/config';

import render from '@/utils/buttons/render';
import setupDomEvents from '@/utils/setupDomEvents';
import setupDomElements from '@/utils/setupDomElements';
import { getState, init as initState } from '@/utils/state';
import { getConfig, init as initConfig } from '@/utils/config';
import setupCssVars from '@/utils/setupCssVars';
import { defaultState } from '@/utils/defaults';
import loadFirstContent from '@/utils/loadFirstContent';
import genericCatch from '@/tools/genericCatch';
import { default as flowInit, flowSetup } from '@/utils/flow/setup';
import { default as fixedInit, fixedSetup } from '@/utils/fixed/setup';
import setupFixedEvents from '@/utils/fixed/setupEvents';

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
  } else {
    // setupFlowVars();
    // setupFlowEvents();
  }

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

  const observer = new MutationObserver(() => {
    console.log('content changed');
    window.requestAnimationFrame(() => {
      console.log('animation frame');
      if (state.layout === 'flow') {
        if (!state.initialized) {
          flowInit();
        } else {
          flowSetup();
        }
      }
      if (state.layout === 'fixed') {
        if (!state.initialized) {
          fixedInit();
        } else {
          fixedSetup();
        }
      }
    });
  });

  observer.observe(state.content, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  loadFirstContent(initialContentSlug).catch(
    genericCatch('Exception loading first content'),
  );

  if (initialOptions.ui?.buttons?.length) {
    render(initialOptions.ui.buttons, state);
  }

  return {
    state,
    config,
  };
};

export default setup;
