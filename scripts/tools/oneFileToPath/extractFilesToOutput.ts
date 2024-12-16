import { dirname, join } from 'path';
import { writeFile } from 'fs/promises';

import type { ExtractedJSONIndexInfo } from './types';

import fastEncrypt from './fastEncrypt';
import ensureDir from '../ensureDir';
import open from '../open';
import readFileBytes from '../readFileBytes';

/**
 * Extracts contents from single compressed files to provided path
 * @param pathToFile Path to compressed file
 * @param jsonIndexInfo JSON Index info (containing bytes positions information)
 * @param outputPath Path to write contents to
 */
const extractFilesToOutput = async (
  pathToFile: string,
  jsonIndexInfo: ExtractedJSONIndexInfo,
  outputPath: string,
): Promise<void> => {
  await ensureDir(outputPath, { recursive: true });
  const { jsonIndexStartByte, jsonIndex, jsonIndexLength, encrypted } =
    jsonIndexInfo;
  const outputPaths = Object.keys(jsonIndex);
  const fd = await open(pathToFile, 'r');
  for (let i = 0, l = outputPaths.length; i < l; i += 1) {
    const relativePath = outputPaths[i];
    if (relativePath) {
      const absolutePath = join(outputPath, relativePath);
      await ensureDir(dirname(absolutePath), { recursive: true });
      const pathInfo = jsonIndex[relativePath];
      if (pathInfo) {
        let { start } = pathInfo;
        const { length } = pathInfo;
        if (start >= jsonIndexStartByte) {
          start += jsonIndexLength;
        }
        let fileBase64Data = await readFileBytes(fd, length, start);
        if (encrypted) {
          fileBase64Data = fastEncrypt(fileBase64Data);
        }
        await writeFile(absolutePath, fileBase64Data, 'base64');
      }
    }
  }
};

export default extractFilesToOutput;
