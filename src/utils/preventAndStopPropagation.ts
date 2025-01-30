const preventAndStopPropagation = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

export default preventAndStopPropagation;
