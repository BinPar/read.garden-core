import { build } from "esbuild";
import { copy } from "esbuild-plugin-copy";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outdir: "build",
  legalComments: "none",
  outExtension: { ".js": ".cjs" },
  sourcemap: false,
  plugins: [copy({
    resolveFrom: "cwd",
    assets: {
      from: ["./assets/**/*"],
      to: ["./build"],
    },
  })],
});
