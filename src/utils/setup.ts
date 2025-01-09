import { type Options } from '@/@types/config';

// import render from '@/utils/buttons/render';
import setupDomEvents from '@/utils/setupDomEvents';
import setupDomElements from '@/utils/setupDomElements';
import { getState, init as initState } from '@/utils/state';
import { getConfig, init as initConfig } from '@/utils/config';
import setupCssVars from '@/utils/setupCssVars';
import { defaultState } from '@/utils/defaults';
import loadFirstContent from '@/utils/loadFirstContent';
import genericCatch from '@/tools/genericCatch';

const setup = (initialOptions: Options) => {
  console.log('setup', initialOptions);

  const readMode = initialOptions.options.readMode ?? defaultState.readMode;

  const domElements = setupDomElements();
  initConfig(initialOptions);
  initState(initialOptions, { readMode, ...domElements });

  const config = getConfig();
  const state = getState();

  domElements.container.classList.add(config.layout);
  domElements.container.classList.add(config.direction);

  setupCssVars();
  setupDomEvents();

  // buttons in options

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

  loadFirstContent(initialContentSlug).catch(
    genericCatch('Exception loading first content'),
  );

  return {
    state,
    config,
  };
};

export default setup;
