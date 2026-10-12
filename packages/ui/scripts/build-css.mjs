// Bundles src/styles.css into a single dist/styles.css by inlining every
// `@import '<specifier>';` (relative paths or package exports such as
// '@ds/tokens/themes.css'). No transformation beyond inlining.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entry = resolve(root, 'src/styles.css');
const IMPORT = /^@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;[ \t]*$/gm;

function inline(file, stack) {
  if (stack.includes(file)) throw new Error(`Circular @import: ${[...stack, file].join(' -> ')}`);
  const source = readFileSync(file, 'utf8');
  return source.replace(IMPORT, (_, specifier) => {
    const target = specifier.startsWith('.')
      ? resolve(dirname(file), specifier)
      : fileURLToPath(import.meta.resolve(specifier, `file://${file}`));
    return inline(target, [...stack, file]).trim();
  });
}

const output = `${inline(entry, []).trim()}\n`;
if (/@import/.test(output.replace(/\/\*[\s\S]*?\*\//g, ''))) {
  throw new Error('Unresolved @import left in dist/styles.css');
}
mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/styles.css'), output);
