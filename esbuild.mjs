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
    }
  ],
  bundle: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  platform: 'node',
  target: 'node20',
  outdir: 'build',
  legalComments: 'none',
  sourcemap: false,
});
