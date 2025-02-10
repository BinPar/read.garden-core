import dispatchEvent from '@/utils/events/dispatchEvent';
import getNodeQuerySelector from '@/utils/getNodeQuerySelector';
import preventAndStopPropagation from '@/utils/preventAndStopPropagation';
import { getState } from '@/utils/state';

const showNoteMenu = ({
  highlighter,
  color,
  mode = 'add',
}: {
  mode?: 'add' | 'edit' | 'show';
  highlighter: string | number;
  color: string;
}) => {
  const state = getState();

  state.notesActions.innerHTML = '';

  if (mode === 'add' || mode === 'edit') {
    const save = state.doc.createElement('button');
    save.title = 'Save';
    save.innerText = 'Save';
    save.classList.add('save');
    state.notesActions.appendChild(save);

    save.addEventListener('pointerdown', (event) => {
      preventAndStopPropagation(event);

      if (
        state.noteHighlightKey &&
        state.noteHighlightRange &&
        state.noteHighlightText
      ) {
        const highlights = state.highlightsByKey.get(state.noteHighlightKey);
        if (highlights) {
          for (let i = 0, l = highlights.length; i < l; i++) {
            const highlight = highlights[i];
            if (highlight) {
              highlight.style.setProperty('--highlighter-color', color);
              highlight.dataset.highlighter = `${highlighter}`;
            }
          }
        }
        dispatchEvent({
          type: 'onNewHighlight',
          highlighter,
          key: state.noteHighlightKey,
          range: {
            obfuscatedText: state.noteHighlightText,
            start: {
              offset: state.noteHighlightRange.startOffset,
              querySelector: getNodeQuerySelector(
                state.noteHighlightRange.startContainer,
              ),
            },
            end: {
              offset: state.noteHighlightRange.endOffset,
              querySelector: getNodeQuerySelector(
                state.noteHighlightRange.endContainer,
              ),
            },
          },
        });
      }
    });

    save.addEventListener('pointerup', preventAndStopPropagation);
    save.addEventListener('pointercancel', preventAndStopPropagation);

    const cancel = state.doc.createElement('button');
    cancel.title = 'Cancel';
    cancel.innerText = 'Cancel';
    cancel.classList.add('cancel');
    state.notesActions.appendChild(cancel);
  }

  if (mode === 'show') {
    const edit = state.doc.createElement('button');
    edit.title = 'Edit';
    edit.innerText = 'Edit';
    edit.classList.add('edit');
    state.notesActions.appendChild(edit);

    const remove = state.doc.createElement('button');
    remove.title = 'Remove';
    remove.innerText = 'Remove';
    remove.classList.add('remove');
    state.notesActions.appendChild(remove);
  }

  state.container.classList.remove('selection-mode');
  state.container.classList.add('note-mode');
};

export default showNoteMenu;
