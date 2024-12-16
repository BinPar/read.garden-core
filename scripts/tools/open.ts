import { promisify } from 'util';
import * as fs from 'fs';

/**
 * Asynchronous open(2) - open and possibly create a file.
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
 * If not supplied, defaults to `0o666`.
 */
const open = promisify(fs.open);

export default open;