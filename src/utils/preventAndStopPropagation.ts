const preventAndStopPropagation = (ev: MouseEvent | PointerEvent) => {
  ev.preventDefault();
  ev.stopPropagation();
};

export default preventAndStopPropagation;
