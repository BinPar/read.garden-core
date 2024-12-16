import { basename, extname, resolve } from 'path';
import { rmdir, stat } from 'fs/promises';
import { tmpdir } from 'os';

import genericCatch from '@/tools/genericCatch';
import ensureDir from './tools/ensureDir';
import download from './tools/download';
import oneFileToPath from './tools/oneFileToPath';

import { env } from './env';

const contents = async () => {
  const contentsPath = resolve(process.cwd(), 'web/contents');
  await ensureDir(contentsPath, { recursive: true });
  for (let i = 0, l = env.CONTENTS.length; i < l; i++) {
    const item = env.CONTENTS[i];
    if (item) {
      try {
        const url = new URL(item);
        const fileName = basename(url.pathname);
        const extName = extname(fileName);
        const bookKey = fileName.replace(extName, '');
        const destinationPath = resolve(contentsPath, bookKey);
        const exists = await stat(destinationPath).catch(() => null);
        if (exists) {
          await rmdir(destinationPath, { recursive: true });
        }
        await ensureDir(contentsPath);
        const tempFile = resolve(tmpdir(), fileName);
        await download(item, tempFile);
        await oneFileToPath(tempFile, destinationPath);
      } catch (ex) {
        genericCatch(`Failed to download content from URL: ${item}`)(ex);
      }
    }
  }
};

contents()
  .then(() => {
    console.info('Contents generated');
  })
  .catch(genericCatch('Contents generation failed'));
