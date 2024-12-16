import { env } from '../../env';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Exchanges pairs of chars in the string
 */
const fastEncrypt = (input: string): string => {
  let lastEqual = input.indexOf('=');
  const source = encoder.encode(input);
  input = '';
  const swap = new Uint8Array(7);
  let pointer = 0;
  while (pointer + 7 < source.length && (lastEqual < 0 || lastEqual > 7)) {
    for (let i = 0; i < 7; i++) {
      const index = env.INDEXES[i];
      if (index === undefined) {
        throw new Error(`Index ${i} not found in encryption indexes`);
      }
      const sourceData = source[pointer + index];
      if (sourceData === undefined) {
        throw new Error(`Source data not found at index ${pointer + index}`);
      }
      swap[i] = sourceData;
    }
    source.set(swap, pointer);
    pointer += 7;
    lastEqual -= 7;
  }
  return decoder.decode(source);
};

export default fastEncrypt;
