const isWebKit = () => {
  return (
    typeof navigator !== 'undefined' &&
    navigator.userAgent.includes('AppleWebKit') &&
    !navigator.userAgent.includes('Chrome')
  );
};

export default isWebKit;
