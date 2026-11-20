// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { beforeAll, describe, expect, it } from 'vitest';
import * as library from './index';
import {
  COMPONENT_LIMIT,
  STYLES_LIMIT,
  externalPackages,
  sizeEntries,
  valueExports,
} from '../scripts/size-entries.mjs';
import sizeLimitConfig from '../.size-limit.mjs';

const packageRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(packageRoot, '../..');
const dist = resolve(packageRoot, 'dist/index.js');
const RADIX_OTHER_THAN_SLOT = /@radix-ui\/(?!react-slot")/;

describe('bundle size limits (DS-038)', () => {
  const entries = sizeLimitConfig as ReturnType<typeof sizeEntries>;
  const componentEntries = entries.filter((entry) => entry.import?.startsWith('{'));

  it('lists every runtime export of src/index.ts', () => {
    const exported = valueExports();
    // The real module namespace is the reference: the parsed list must match it exactly.
    expect(exported.slice().sort()).toEqual(Object.keys(library).sort());
    expect(componentEntries.map((entry) => entry.name).sort()).toEqual(exported.slice().sort());
  });

  it('gives every export a 5 kB gzip limit with the dependencies of the consumer as externals', () => {
    for (const entry of componentEntries) {
      expect(entry.path).toBe('dist/index.js');
      expect(entry.import).toBe(`{ ${entry.name} }`);
      expect(entry.limit).toBe(COMPONENT_LIMIT);
      expect(entry.gzip).toBe(true);
      expect(entry.ignore).toEqual(
        expect.arrayContaining([
          'react',
          'react-dom',
          'react/jsx-runtime',
          '@radix-ui/react-dialog',
          '@up201905892/icons',
        ]),
      );
    }
    expect(COMPONENT_LIMIT).toBe('5 kB');
    expect(externalPackages().every((name) => !name.startsWith('.'))).toBe(true);
  });

  it('measures styles.css (15 kB) and the whole library (no limit)', () => {
    const styles = entries.find((entry) => entry.path === 'dist/styles.css');
    expect(styles).toMatchObject({ limit: STYLES_LIMIT, gzip: true });
    expect(STYLES_LIMIT).toBe('15 kB');
    const whole = entries.find((entry) => entry.import === '*');
    expect(whole).toBeDefined();
    expect(whole?.limit).toBeUndefined();
  });

  it('ignores `export type` lines and multi-line export lists when parsing', () => {
    const source = [
      "export { A, B as C } from './a';",
      "export type { AProps } from './a';",
      'export {',
      '  D,',
      '  type DProps,',
      "} from './d';",
    ].join('\n');
    expect(valueExports(source)).toEqual(['A', 'C', 'D']);
  });

  describe('tree-shaking of dist/index.js', () => {
    beforeAll(() => {
      if (!existsSync(dist)) {
        execFileSync('pnpm', ['--filter', '@up201905892/ui', 'build'], {
          cwd: repoRoot,
          stdio: 'inherit',
        });
      }
    }, 240_000);

    async function bundleOf(name: string): Promise<string> {
      const result = await build({
        stdin: {
          contents: `export { ${name} } from './dist/index.js';`,
          resolveDir: packageRoot,
          loader: 'js',
        },
        bundle: true,
        write: false,
        format: 'esm',
        treeShaking: true,
        external: ['react', 'react-dom', 'react/jsx-runtime', '@radix-ui/*', '@up201905892/icons'],
        // Like a consumer bundler: the Radix packages and the icons declare `sideEffects: false`,
        // so an external import that nothing uses is dropped instead of kept as `import 'x'`.
        plugins: [
          {
            name: 'side-effect-free-externals',
            setup(pluginBuild) {
              pluginBuild.onResolve({ filter: /^(@radix-ui\/|@up201905892\/icons)/ }, (args) => ({
                path: args.path,
                external: true,
                sideEffects: false,
              }));
            },
          },
        ],
      });
      return result.outputFiles[0]?.text ?? '';
    }

    // The build writes each component as one pure expression (`Object.assign(forwardRef(...),
    // { displayName })`), see tsup.config.ts. A top-level `Name.displayName = '...'` statement
    // would be kept by esbuild as a side effect and pull in the whole library.
    it('keeps the unrelated code out of an `import { Button }` bundle', async () => {
      expect(readFileSync(dist, 'utf8')).toContain('@radix-ui/react-dialog');
      const text = await bundleOf('Button');
      expect(text).not.toContain('@radix-ui/react-dialog');
      expect(text).not.toContain('ds-dialog');
    });

    it('keeps the unrelated code out of an `import { Stack }` bundle', async () => {
      const text = await bundleOf('Stack');
      // `asChild` makes Stack use Radix Slot, so that one package stays; no other Radix package may.
      expect(text).not.toMatch(RADIX_OTHER_THAN_SLOT);
      expect(text).not.toContain('ds-button');
    });

    it('keeps the unrelated code out of an `import { Badge }` bundle', async () => {
      const text = await bundleOf('Badge');
      expect(text).not.toMatch(RADIX_OTHER_THAN_SLOT);
      expect(text).not.toContain('ds-dialog');
    });

    it('has no top-level `displayName` assignment left in dist/index.js', () => {
      expect(readFileSync(dist, 'utf8')).not.toMatch(/^\w+\.displayName = /m);
    });

    it('still exports the same names, with the same displayName, from the built file', async () => {
      const built = (await import(/* @vite-ignore */ dist)) as Record<string, unknown>;
      expect(Object.keys(built).sort()).toEqual(Object.keys(library).sort());
      for (const [name, value] of Object.entries(built)) {
        if (/^[A-Z]/.test(name)) {
          // Plain function components (Dialog, Popover...) are named by their function.
          const component = value as { displayName?: string; name?: string };
          expect(component.displayName ?? component.name, name).toBe(name);
        }
      }
    });
  });
});
