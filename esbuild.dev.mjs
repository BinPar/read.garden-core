import { context } from 'esbuild';

const ctx = await context({
  loader: {
    '.js': 'file',
    '.css': 'css',
    '.svg': 'copy',
    '.png': 'copy',
  },
  assetNames: '[name][ext]',
  entryPoints: [
    {
      out: 'js/rg-core',
      in: 'src/index.ts',
    },
    {
      out: '',
      in: 'assets/**/*',
    },
    {
      in: 'dev/viewer.ts',
      out: 'js/viewer',
    },
  ],
  bundle: true,
  minify: false,
  outdir: 'web',
  platform: 'browser',
  target: ['es2019'],
  sourcemap: true,
  legalComments: 'none',
});

await ctx.watch();
