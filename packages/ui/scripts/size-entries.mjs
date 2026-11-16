// Builds the size-limit entries from the runtime exports of src/index.ts, so that a new
// component cannot ship without a size limit (src/size-limit.test.ts checks the same list).
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const COMPONENT_LIMIT = '5 kB';
export const STYLES_LIMIT = '15 kB';

/** Names exported as values (not `export type`) by src/index.ts. */
export function valueExports(source = readFileSync(resolve(root, 'src/index.ts'), 'utf8')) {
  const names = [];
  for (const match of source.matchAll(/^export\s+\{([^}]*)\}\s+from\s+['"][^'"]+['"];?/gm)) {
    for (const part of match[1].split(',')) {
      const name = part.trim();
      if (name && !name.startsWith('type ')) names.push(name.split(/\s+as\s+/).pop());
    }
  }
  return names;
}

/** Packages the consumer installs: not counted in the size of the library. */
export function externalPackages() {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const names = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];
  return [...new Set([...names, 'react/jsx-runtime', 'react/jsx-dev-runtime'])];
}

export function sizeEntries(exportNames = valueExports()) {
  const ignore = externalPackages();
  return [
    ...exportNames.map((name) => ({
      name,
      path: 'dist/index.js',
      import: `{ ${name} }`,
      limit: COMPONENT_LIMIT,
      gzip: true,
      ignore,
    })),
    // Plain file: measured as is (gzip), not bundled.
    {
      name: 'styles.css',
      path: 'dist/styles.css',
      limit: STYLES_LIMIT,
      gzip: true,
      rolldown: false,
    },
    // Informative only (no limit): the whole library.
    { name: 'whole library (informative)', path: 'dist/index.js', import: '*', gzip: true, ignore },
  ];
}
