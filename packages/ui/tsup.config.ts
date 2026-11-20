import { readFile } from 'node:fs/promises';
import type { Plugin } from 'esbuild';
import { defineConfig } from 'tsup';

// Tree-shaking (DS-060). esbuild keeps a top-level `Name.displayName = '...'` statement as a side
// effect, so a consumer bundler would pull the whole library into `import { Button }`. This plugin
// rewrites `const X = forwardRef(...); X.displayName = 'X';` into one pure expression
// (`Object.assign(forwardRef(...), { displayName })`) and marks `createContext` as pure, so an
// unused component is dropped. The sources stay in the usual readable form.
const pureComponents: Plugin = {
  name: 'pure-component-calls',
  setup(build) {
    build.onLoad({ filter: /\/src\/.*\.tsx$/ }, async (args) => {
      const source = await readFile(args.path, 'utf8');
      const contents = source
        // `const X = forwardRef(...);  X.displayName = 'X';` becomes one pure expression.
        .replace(
          /^((?:export )?const (\w+) = )(forwardRef[\s\S]*?);\n+\2\.displayName = ('[^']*');/gm,
          '$1/* @__PURE__ */ Object.assign(/* @__PURE__ */ $3, { displayName: $4 });',
        )
        .replace(/^((?:export )?const \w+ = )(createContext)\b/gm, '$1/* @__PURE__ */ $2');
      return { contents, loader: 'tsx' };
    });
  },
};

// dist/styles.css is produced by scripts/build-css.mjs (runs after tsup).
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [pureComponents],
  external: ['react', 'react-dom'],
});
