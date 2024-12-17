import { build } from 'esbuild';

await build({
  loader: {
    '.js': 'file',
    '.css': 'css',
    '.svg': 'copy',
  },
  entryPoints: [
    {
      out: 'index',
      in: 'src/index.ts',
    },
    {
      out: '',
      in: 'assets/**/*',
    },
  ],
  bundle: true,
  minify: true,
  // minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  outdir: 'build',
  platform: 'node',
  // target: ['es2019'],
  sourcemap: false,
  legalComments: 'none',
}).catch(() => process.exit(1));
