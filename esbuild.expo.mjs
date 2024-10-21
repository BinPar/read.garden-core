import { context } from 'esbuild';
import packageJson from './package.json' with { type: 'json' };

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
  outdir: packageJson.readGarden.publish.expoPath,
  outExtension: { '.js': '.cjs' },
  legalComments: 'none',
  sourcemap: false,
});

console.log(packageJson.readGarden.publish.expoPath);

await ctx.watch();
