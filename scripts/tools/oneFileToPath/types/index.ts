/**
 * JSON Index paths info
 */
export type JSONIndex = Record<string, { start: number; length: number }>;

/**
 * Extracted JSON Index info
 */
export interface ExtractedJSONIndexInfo {
  encrypted: boolean;
  jsonIndex: JSONIndex;
  jsonIndexStartByte: number;
  jsonIndexLength: number;
}
