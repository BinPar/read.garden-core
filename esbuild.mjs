import { build } from 'esbuild';

await build({
  loader: {
    '.js': 'file',
    '.css': 'css',
    '.svg': 'copy',
  },
  entryPoints: [
    {
      out: 'rg-core',
      in: 'src/index.ts',
    },
    {
      out: '',
      in: 'assets/**/*',
    },
  ],
  bundle: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  outdir: 'build',
  outExtension: { '.js': '.cjs' },
  platform: 'node',
  target: 'node20',
  sourcemap: false,
  legalComments: 'none',
});
