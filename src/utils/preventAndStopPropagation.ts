const preventAndStopPropagation = (ev: Event) => {
  ev.preventDefault();
  ev.stopPropagation();
};

export default preventAndStopPropagation;
