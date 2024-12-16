const genericCatch = (messagePrefix: string) => (ex: unknown) => {
  const { message, stack } = ex as Error;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  console.error(`${messagePrefix}: ${stack || message || JSON.stringify(ex)}`);
};

export default genericCatch;
