import { defineConfig } from 'tsup';

// dist/styles.css is produced by scripts/build-css.mjs (runs after tsup).
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
