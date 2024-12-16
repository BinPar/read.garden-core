import { stat } from 'fs/promises';
import { Base64 } from 'js-base64';

import type { ExtractedJSONIndexInfo, JSONIndex } from './types';

import fastEncrypt from './fastEncrypt';
import open from '../open';
import readFileBytes from '../readFileBytes';

const JSON_INDEX_BYTES = 32;

/**
 * Extracts json index from compressed file
 * @param pathToFile Path to compressed file
 * @returns Extracted JSON Index info
 */
const extractJsonIndex = async (
  pathToFile: string,
): Promise<ExtractedJSONIndexInfo> => {
  const fileStats = await stat(pathToFile);
  if (fileStats?.size) {
    const { size } = fileStats;
    const fd = await open(pathToFile, 'r');
    const base64JsonIndexPosition = await readFileBytes(
      fd,
      JSON_INDEX_BYTES,
      size - JSON_INDEX_BYTES,
    );
    const jsonPositions = Base64.fromBase64(base64JsonIndexPosition);
    const [jsonIndexPosition, jsonIndexLength] = jsonPositions
      .split('-')
      .map((bytes) => parseInt(bytes, 10)) as [number, number];

    let base64JsonIndex = await readFileBytes(
      fd,
      jsonIndexLength,
      jsonIndexPosition,
    );
    const encrypted = !base64JsonIndex.startsWith('ey');
    if (encrypted) {
      base64JsonIndex = fastEncrypt(base64JsonIndex);
    }

    return {
      encrypted,
      jsonIndex: JSON.parse(Base64.fromBase64(base64JsonIndex)) as JSONIndex,
      jsonIndexLength,
      jsonIndexStartByte: jsonIndexPosition,
    };
  }
  throw new Error('Not found');
};

export default extractJsonIndex;
