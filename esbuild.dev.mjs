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
  ],
  bundle: true,
  minify: false,
  platform: 'node',
  target: 'node20',
  outdir: 'web',
  legalComments: 'none',
  sourcemap: false, // Not sure
});

await ctx.watch();
