import type setup from '@/utils/setup';

declare global {
  interface Window {
    rgCore: ReturnType<typeof setup>;
    readGardenCore: typeof setup;
  }
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
