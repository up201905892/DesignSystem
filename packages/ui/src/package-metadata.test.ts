import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

type Manifest = {
  name: string;
  private?: boolean;
  license?: string;
  main?: string;
  module?: string;
  types?: string;
  files?: string[];
  sideEffects?: boolean | string[];
  exports?: Record<string, unknown>;
  peerDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  publishConfig?: { access?: string };
};

const repoRoot = resolve(import.meta.dirname, '../../..');
const packages = ['tokens', 'icons', 'ui'] as const;

const dir = (name: string) => join(repoRoot, 'packages', name);
const read = (name: string): Manifest =>
  JSON.parse(readFileSync(join(dir(name), 'package.json'), 'utf8')) as Manifest;

/** Every string leaf of a value (the file paths of `exports`). */
function leaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (value && typeof value === 'object') return Object.values(value).flatMap(leaves);
  return [];
}

/** Paths a package.json points at: `exports` leaves plus main, module and types. */
function referencedPaths(manifest: Manifest): string[] {
  const direct = [manifest.main, manifest.module, manifest.types].filter(
    (p): p is string => typeof p === 'string',
  );
  // The "source" condition only serves the monorepo and is not published.
  const exported = Object.values(manifest.exports ?? {}).flatMap((entry) => {
    if (entry && typeof entry === 'object') {
      return leaves(Object.fromEntries(Object.entries(entry).filter(([key]) => key !== 'source')));
    }
    return leaves(entry);
  });
  return [...direct, ...exported];
}

describe('published package metadata (DS-036)', () => {
  beforeAll(() => {
    const missing = packages.some((name) =>
      referencedPaths(read(name)).some((p) => !existsSync(join(dir(name), p))),
    );
    // `pnpm test` can run before `pnpm build` on a clean clone: build what is missing.
    if (missing) {
      for (const name of packages) {
        execFileSync('pnpm', ['--filter', read(name).name, 'build'], {
          cwd: repoRoot,
          stdio: 'inherit',
        });
      }
    }
  }, 240_000);

  describe.each(packages)('@up201905892/%s', (pkg) => {
    const manifest = read(pkg);

    it('has the final name, is public and uses the MIT licence', () => {
      expect(manifest.name).toBe(`@up201905892/${pkg}`);
      expect(manifest.private).toBeUndefined();
      expect(manifest.license).toBe('MIT');
      expect(manifest.publishConfig?.access).toBe('public');
    });

    it('points every exports/main/module/types path at an existing file', () => {
      const paths = referencedPaths(manifest);
      expect(paths.length).toBeGreaterThan(0);
      for (const p of paths) {
        expect(existsSync(join(dir(pkg), p)), `${pkg}: ${p} does not exist`).toBe(true);
      }
    });

    it('does not publish src', () => {
      expect(manifest.files).toBeDefined();
      for (const entry of manifest.files ?? []) {
        expect(entry).not.toMatch(/^(\.\/)?src(\/|$)/);
      }
    });

    it('exposes ./package.json and ships a LICENSE and a README', () => {
      expect(manifest.exports?.['./package.json']).toBe('./package.json');
      expect(existsSync(join(dir(pkg), 'LICENSE'))).toBe(true);
      expect(existsSync(join(dir(pkg), 'README.md'))).toBe(true);
    });
  });

  it('declares the entry points of each package', () => {
    expect(Object.keys(read('tokens').exports ?? {})).toEqual([
      '.',
      './tokens.css',
      './themes.css',
      './package.json',
    ]);
    expect(Object.keys(read('icons').exports ?? {})).toEqual(['.', './package.json']);
    expect(Object.keys(read('ui').exports ?? {})).toEqual(['.', './styles.css', './package.json']);
  });

  it('declares side effects and files', () => {
    expect(read('ui').sideEffects).toEqual(['**/*.css']);
    expect(read('tokens').sideEffects).toEqual(['**/*.css']);
    expect(read('icons').sideEffects).toBe(false);
    expect(read('ui').files).toEqual(['dist']);
    expect(read('tokens').files).toEqual(['dist']);
    expect(read('icons').files).toEqual(['dist', 'LICENSE-LUCIDE']);
  });

  it('ui: separate ESM and CJS declarations, React as peer, Radix and icons as dependencies', () => {
    const ui = read('ui');
    const root = ui.exports?.['.'] as Record<string, Record<string, string>>;
    expect(root.import?.types).toBe('./dist/index.d.ts');
    expect(root.require?.types).toBe('./dist/index.d.cts');
    expect(Object.keys(ui.peerDependencies ?? {})).toEqual(['react', 'react-dom']);
    expect(ui.dependencies?.['@up201905892/icons']).toBe('workspace:^');
    for (const name of Object.keys(ui.dependencies ?? {})) {
      expect(name).toMatch(/^@(radix-ui\/react-|up201905892\/icons)/);
    }
  });

  it('ui: the bundle keeps dependencies external', () => {
    const bundle = readFileSync(join(dir('ui'), 'dist/index.js'), 'utf8');
    expect(bundle).toMatch(/from ["']@radix-ui\/react-slot["']/);
    expect(bundle).toMatch(/from ["']@up201905892\/icons["']/);
    expect(bundle).toMatch(/from ["']react["']/);
  });

  it('nothing outside docs/workflow still refers to @ds/', () => {
    const sources = ['packages/ui/src/styles.css', 'packages/ui/package.json'];
    for (const file of sources) {
      expect(readFileSync(join(repoRoot, file), 'utf8')).not.toContain('@ds/');
    }
  });
});
