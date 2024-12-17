import { context } from 'esbuild';

const ctx = await context({
  loader: {
    '.js': 'file',
    '.css': 'css',
    '.svg': 'copy',
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
  platform: 'browser',
  target: ['es2019'],
  outdir: 'web',
  legalComments: 'none',
  sourcemap: false,
});

await ctx.watch();
