import { context } from 'esbuild';
import packageJson from './package.json' with { type: 'json' };

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
  ],
  bundle: true,
  minify: false,
  platform: 'browser',
  target: 'node20',
  outdir: packageJson.readGarden.publish.rgAppExpoPath,
  outExtension: { '.js': '.viewerjs' },
  legalComments: 'none',
  sourcemap: false,
});

await ctx.watch();
