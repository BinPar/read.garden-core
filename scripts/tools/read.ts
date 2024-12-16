import { promisify } from 'util';
import * as fs from 'fs';

/**
 * Asynchronously reads data from the file referenced by the supplied file descriptor.
 * @param fd A file descriptor.
 * @param buffer The buffer that the data will be written to.
 * @param offset The offset in the buffer at which to start writing.
 * @param length The number of bytes to read.
 * @param position The offset from the beginning of the file from which data should be read.
 * If `null`, data will be read from the current position.
 */
const read = promisify(fs.read);

export default read;
