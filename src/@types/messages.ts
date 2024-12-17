import type { Options } from '@/@types/config';

export interface Init {
  type: 'init';
  options: Options;
}

export type Message = Init;