import dispatch from '@/utils/dispatch';
import dispatchEvent from '@/utils/events/dispatchEvent';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import { getState, updateState } from '@/utils/state';

const showNoteMenu = (mode: 'add' | 'edit' | 'show' = 'add') => {
  const resize = () => {
    const viewportHeight = window.visualViewport?.height ?? 0;
    const windowHeight = window.innerHeight;
    const keyboardThreshold = 100; // Umbral en píxeles para considerar que el teclado está abierto

    const noteMenu = state.noteMenu;

    if (windowHeight - viewportHeight > keyboardThreshold) {
      noteMenu.style.bottom = `${windowHeight - viewportHeight}px`;
    } else {
      noteMenu.style.removeProperty('bottom');
    }
  };

  const state = getState();

  state.notesActions.innerHTML = '';
  state.noteMenu.classList.remove('add', 'edit', 'show');
  state.noteMenu.classList.add(mode);
  state.textarea.value = '';
  state.textarea.readOnly = false;

  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', resize);
  }

  if (mode === 'add') {
    const { currentHighlight } = state;
    if (!currentHighlight) {
      console.error(`No currentHighlight when adding note`);
      return;
    }

    const save = state.doc.createElement('button');
    save.title = 'Save';
    save.innerText = 'Save';
    save.classList.add('save');

    save.addEventListener('pointerdown', (event) => {
      preventAndStopPropagation(event);

      const note = state.textarea.value;
      state.coreHighlightsByKey.set(currentHighlight.key, {
        ...currentHighlight,
        note,
      });

      dispatchEvent({
        type: 'onNewHighlight',
        highlighter: currentHighlight.highlighter,
        key: currentHighlight.key,
        range: currentHighlight.selectionRange,
        note,
      });
      updateState({
        currentHighlight: null,
      });
    });

    save.addEventListener('pointerup', preventAndStopPropagation);
    save.addEventListener('pointercancel', preventAndStopPropagation);

    const cancel = state.doc.createElement('button');
    cancel.title = 'Cancel';
    cancel.innerText = 'Cancel';
    cancel.classList.add('cancel');

    cancel.addEventListener('pointerdown', (event) => {
      preventAndStopPropagation(event);

      for (let i = 0, l = currentHighlight.domHighlights.length; i < l; i++) {
        const domHighlight = currentHighlight.domHighlights[i];
        if (domHighlight) {
          domHighlight.remove();
        }
      }

      updateState({
        currentHighlight: null,
      });

      state.coreHighlightsByKey.delete(currentHighlight.key);
    });

    state.notesActions.appendChild(save);
    state.notesActions.appendChild(cancel);
  }

  if (mode === 'show' || mode === 'edit') {
    const { clickedNoteHighlight } = state;
    if (!clickedNoteHighlight) {
      console.error(`No clickedNoteHighlight when showing note`);
      return;
    }

    const clickedHighlight = state.userHighlightsById.get(clickedNoteHighlight);
    if (!clickedHighlight) {
      console.error(
        `No clickedHighlight for id ${clickedNoteHighlight} when showing note`,
      );
      return;
    }

    const domHighlights = state.domHighlightsById.get(clickedNoteHighlight);
    if (!domHighlights?.length) {
      console.error(
        `No domHighlights for id ${clickedNoteHighlight} when showing note`,
      );
    }

    state.textarea.value = clickedHighlight.note ?? '';

    if (mode === 'show') {
      state.textarea.readOnly = true;

      const edit = state.doc.createElement('button');
      edit.title = 'Edit';
      edit.innerText = 'Edit';
      edit.classList.add('edit');

      edit.addEventListener('pointerdown', (event) => {
        preventAndStopPropagation(event);
        showNoteMenu('edit');
      });

      edit.addEventListener('pointerup', preventAndStopPropagation);
      edit.addEventListener('pointercancel', preventAndStopPropagation);

      const remove = state.doc.createElement('button');
      remove.title = 'Remove';
      remove.innerText = 'Remove';
      remove.classList.add('remove');

      remove.addEventListener('pointerdown', (event) => {
        preventAndStopPropagation(event);
        dispatchEvent({
          type: 'onHighlightRemove',
          id: clickedNoteHighlight,
        });
        dispatch({
          type: 'removeHighlights',
          ids: [clickedNoteHighlight],
        });
        updateState({ clickedNoteHighlight: null });
      });

      remove.addEventListener('pointerup', preventAndStopPropagation);
      remove.addEventListener('pointercancel', preventAndStopPropagation);

      state.notesActions.appendChild(edit);
      state.notesActions.appendChild(remove);
    }

    if (mode === 'edit') {
      state.textarea.readOnly = false;

      const save = state.doc.createElement('button');
      save.title = 'Save';
      save.innerText = 'Save';
      save.classList.add('save');

      save.addEventListener('pointerdown', (event) => {
        preventAndStopPropagation(event);
        const note = state.textarea.value;
        dispatchEvent({
          type: 'onNoteEdit',
          id: clickedNoteHighlight,
          note,
        });
        state.userHighlightsById.set(clickedNoteHighlight, {
          ...clickedHighlight,
          note,
        });
        showNoteMenu('show');
      });

      save.addEventListener('pointerup', preventAndStopPropagation);
      save.addEventListener('pointercancel', preventAndStopPropagation);

      const cancel = state.doc.createElement('button');
      cancel.title = 'Cancel';
      cancel.innerText = 'Cancel';
      cancel.classList.add('cancel');

      cancel.addEventListener('pointerdown', (event) => {
        preventAndStopPropagation(event);
        state.textarea.value = clickedHighlight.note ?? '';
        showNoteMenu('show');
      });

      cancel.addEventListener('pointerup', preventAndStopPropagation);
      cancel.addEventListener('pointercancel', preventAndStopPropagation);

      state.notesActions.appendChild(save);
      state.notesActions.appendChild(cancel);
    }
  }

  if (mode === 'add' || mode === 'edit') {
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', resize);
    }

    setTimeout(
      () => {
        state.textarea.focus({
          preventScroll: true,
        });
        if (mode === 'edit') {
          state.textarea.select();
        }
      },
      mode === 'add' ? 512 : 256,
    );
  }

  state.container.classList.remove('selection-mode');
  state.container.classList.add('note-mode');
};

export default showNoteMenu;
