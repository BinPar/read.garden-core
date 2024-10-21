import { context } from 'esbuild';
// import { copy } from 'esbuild-plugin-copy';

const ctx = await context({
  loader: {
    '.js': 'file',

  },
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: false,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outdir: 'web/js',
  legalComments: 'none',
  outExtension: { '.js': '.js' },
  sourcemap: true,
  // plugins: [
  //   copy({
  //     resolveFrom: 'cwd',
  //     assets: {
  //       from: ['./assets/**/*'],
  //       to: ['./web'],
  //     },
  //   }),
  // ],
});

await ctx.watch();
