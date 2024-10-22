const setupDomEvents = () => {
  let timeout: NodeJS.Timeout;
  const touches = new Set<number>();

  const longPressDuration = 500;

  const handleTouchStart = (event: PointerEvent) => {
    touches.add(event.pointerId);
    if(touches.size == 1 ) {
        timeout = setTimeout(handleLongPress, longPressDuration);
    }
  };

  const checkIfScreenXBorderIsPressed = (e: PointerEvent) => {
    const touchX = e.x;
    if (touchX) {
      const threshold = 20;
      const w = window.innerWidth;
      const pixels = w * (threshold / 100);

      if (touchX <= pixels) {
        console.log({ pixels, touchX });
        document.body.scrollLeft -= document.body.clientWidth;
      }

      if (touchX > w - pixels) {
        console.log({ touchX, content: w - pixels });
        document.body.scrollLeft += document.body.clientWidth;
      }
    }
  };

  const handleTouchEnd = (event: PointerEvent) => {
    touches.delete(event.pointerId);
    clearTimeout(timeout);
    checkIfScreenXBorderIsPressed(event);
  };

  const handleLongPress = () => {
    if (touches.size != 1) {
      return null;
    }
    alert('Has hecho una pulsación larga');
  };

  document.addEventListener('pointerdown', handleTouchStart);
  document.addEventListener('pointerup', handleTouchEnd);
  document.addEventListener('pointercancel', handleTouchEnd);
};

export default setupDomEvents;
