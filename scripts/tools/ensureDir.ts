import type { MakeDirectoryOptions } from 'fs';
import { mkdir } from 'fs/promises';

const ensureDir = async (
  folderPath: string,
  options: MakeDirectoryOptions = {},
): Promise<void> => {
  try {
    await mkdir(folderPath, options);
  } catch (ex) {
    const error = ex as NodeJS.ErrnoException;
    if (error.code !== 'EEXIST') {
      throw ex;
    }
  }
};

export default ensureDir;
