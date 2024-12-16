import { env } from '../../env';

/**
 * Exchanges pairs of chars in the string
 */
const fastEncrypt = (input: string): string => {
  let result = '';
  let lastEqual = input.indexOf('=');
  while (input.length > 7 && (lastEqual < 0 || lastEqual > 7)) {
    result += `${input[env.INDEXES[0]]}${input[env.INDEXES[1]]}${input[env.INDEXES[2]]}${
      input[env.INDEXES[3]]
    }${input[env.INDEXES[4]]}${input[env.INDEXES[5]]}${input[env.INDEXES[6]]}`;
    input = input.substring(7);
    lastEqual -= 7;
  }
  if (input) {
    result += input;
  }
  return result;
};

export default fastEncrypt;
