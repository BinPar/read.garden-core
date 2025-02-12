import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import redrawHighlights from '@/utils/redrawHighlights';
import { getState, updateState } from '@/utils/state';
import updateProgress from '@/utils/updateProgress';

const setupSnaps = () => {
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
      redrawHighlights();
      updateState({ rendering: false });
      window.requestAnimationFrame(() => {
        setCssVariable('overflow-x', 'auto');
        setCssVariable('scroll-behavior', 'smooth');
        setCssVariable('scroll-snap-type', 'x mandatory');
        updateProgress();
      });
    });
  });
};

export default setupSnaps;
