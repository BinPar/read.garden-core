import read from './read';

/**
 * Reads file bytes
 * @param fd A file descriptor.
 * @param length The number of bytes to read
 * @param position The offset from the beginning of the file from which data should be read.
 * If `null`, data will be read from the current position.
 * @param encoding Encoding. Defaults to `base64`.
 */
const readFileBytes = async (
  fd: number,
  length: number,
  position: number,
  encoding: BufferEncoding = 'base64',
): Promise<string> => {
  const buffer = Buffer.alloc(length);
  const res = await read(fd, buffer, 0, length, position);
  const bytes = buffer.toString(encoding, 0, res.bytesRead);
  return bytes;
};

export default readFileBytes;
