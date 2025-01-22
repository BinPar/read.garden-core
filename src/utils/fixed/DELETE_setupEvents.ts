import setCssVariable from '@/tools/setCssVariable';
import { getConfig } from '@/utils/config';
import { getState } from '@/utils/state';

class Pointer {
  /** x offset from the top of the document */
  pageX: number;
  /** y offset from the top of the document */
  pageY: number;
  /** x offset from the top of the viewport */
  clientX: number;
  /** y offset from the top of the viewport */
  clientY: number;
  /** Unique ID for this pointer */
  id = -1;
  /** The platform object used to create this Pointer */
  nativePointer: Touch | PointerEvent | MouseEvent;

  constructor(nativePointer: Touch | PointerEvent | MouseEvent) {
    this.nativePointer = nativePointer;
    this.pageX = nativePointer.pageX;
    this.pageY = nativePointer.pageY;
    this.clientX = nativePointer.clientX;
    this.clientY = nativePointer.clientY;

    if (self.Touch && nativePointer instanceof Touch) {
      this.id = nativePointer.identifier;
    } else if (isPointerEvent(nativePointer)) {
      // is PointerEvent
      this.id = nativePointer.pointerId;
    }
  }

  /**
   * Returns an expanded set of Pointers for high-resolution inputs.
   */
  getCoalesced(): Pointer[] {
    if ('getCoalescedEvents' in this.nativePointer) {
      const events = this.nativePointer
        .getCoalescedEvents()
        .map((p) => new Pointer(p));
      // Firefox sometimes returns an empty list here. I'm not sure it's doing the right thing.
      // https://github.com/w3c/pointerevents/issues/409
      if (events.length > 0) return events;
      // Otherwise, Firefox falls through…
    }
    return [this];
  }
}

interface Point {
  clientX: number;
  clientY: number;
}

const enum Buttons {
  None,
  LeftMouseOrTouchOrPenDown,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPointerEvent = (event: any): event is PointerEvent =>
  'pointerId' in event;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTouchEvent = (event: any): event is TouchEvent =>
  'changedTouches' in event;

const getDistance = (a: Point, b?: Point) => {
  if (!b) {
    return 0;
  }
  return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
};

const setupEvents = () => {
  const state = getState();
  const config = getConfig();

  if (state.layout !== 'fixed' || config.layout !== 'fixed') {
    return;
  }

  const element = state.viewer;
  const excludeFromButtonsCheck = new Set<number>();
  const currentPointers = new Array<Pointer>();
  const startPointers = new Array<Pointer>();

  let scale = config.zoom;

  const updateScale = () => {
    setCssVariable('zoom', `${scale}`);
  };

  const triggerPointerEnd = (
    pointer: Pointer,
    event: TouchEvent | PointerEvent | MouseEvent,
  ) => {
    if (
      !isTouchEvent(event) &&
      event.buttons & Buttons.LeftMouseOrTouchOrPenDown
    ) {
      return false;
    }

    const index = currentPointers.findIndex((p) => p.id === pointer.id);
    if (index === -1) {
      return false;
    }

    currentPointers.splice(index, 1);
    startPointers.splice(index, 1);
    excludeFromButtonsCheck.delete(pointer.id);

    return true;
  };

  const pointerEnd = (event: PointerEvent | MouseEvent) => {
    console.log('end', event.type);
    if (!triggerPointerEnd(new Pointer(event), event)) {
      return;
    }

    if (isPointerEvent(event)) {
      if (currentPointers.length) {
        return;
      }
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', pointerEnd);
      element.removeEventListener('pointercancel', pointerEnd);
    } else {
      // MouseEvent
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', pointerEnd);
    }
  };

  const move = (event: PointerEvent | MouseEvent | TouchEvent) => {
    console.log('move');
    if (
      !isTouchEvent(event) &&
      (!isPointerEvent(event) ||
        !excludeFromButtonsCheck.has(event.pointerId)) &&
      event.buttons === 0
    ) {
      // This happens in a number of buggy cases where the browser failed to deliver a pointerup
      // or pointercancel. If we see the pointer moving without any buttons down, synthesize an end.
      // https://github.com/w3c/pointerevents/issues/407
      // https://github.com/w3c/pointerevents/issues/408
      pointerEnd(event);
      console.log('No buttons down');
      return;
    }

    const previousPointers = currentPointers.slice();
    const changedPointers = isTouchEvent(event)
      ? Array.from(event.changedTouches).map((t) => new Pointer(t))
      : [new Pointer(event)];
    const trackedChangedPointers = [];

    for (const pointer of changedPointers) {
      const index = currentPointers.findIndex((p) => p.id === pointer.id);
      if (index === -1) {
        continue; // Not a pointer we're tracking
      }
      trackedChangedPointers.push(pointer);
      currentPointers[index] = pointer;
    }

    if (trackedChangedPointers.length === 0) {
      console.log('No tracked pointers');
      return;
    }

    // this._moveCallback(previousPointers, trackedChangedPointers, event);
    // pinch-zoom

    const positioningElement = element.children[0];
    if (
      !positioningElement ||
      previousPointers[0] === undefined ||
      currentPointers[0] === undefined
    ) {
      console.log('No positioning element or pointers');
      return;
    }

    // Calculate the desired change in scale
    const prevDistance = getDistance(previousPointers[0], previousPointers[1]);

    if (prevDistance) {
      const scaleDiff =
        getDistance(currentPointers[0], currentPointers[1]) / prevDistance;
      console.log({ scaleDiff });
      scale *= scaleDiff;
      updateScale();
    }
  };

  const pointerStart = (event: PointerEvent | MouseEvent) => {
    if (isPointerEvent(event) && event.buttons === 0) {
      excludeFromButtonsCheck.add(event.pointerId);
    } else if (!(event.buttons & Buttons.LeftMouseOrTouchOrPenDown)) {
      return;
    }

    const pointer = new Pointer(event);
    if (currentPointers.some((p) => p.id === pointer.id)) {
      return;
    }

    currentPointers.push(pointer);
    startPointers.push(pointer);

    if (isPointerEvent(event)) {
      const capturingElement = (
        event.target && 'setPointerCapture' in event.target
          ? event.target
          : state.content
      ) as HTMLElement;

      capturingElement.setPointerCapture(event.pointerId);
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerup', pointerEnd);
      // element.addEventListener('pointercancel', pointerEnd);
    } else {
      // MouseEvent
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', pointerEnd);
    }
  };

  element.addEventListener('pointerdown', pointerStart);
};

export default setupEvents;
