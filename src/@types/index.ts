import type setup from '@/utils/setup';

declare global {
  interface Window {
    rgCore: ReturnType<typeof setup>;
    readGardenCore: typeof setup;
  }
}
