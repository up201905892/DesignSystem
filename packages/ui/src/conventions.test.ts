import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const srcDir = import.meta.dirname;

/** Component folders: directories in `src/` whose name starts with an uppercase letter. */
const components = readdirSync(srcDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^[A-Z]/.test(entry.name))
  .map((entry) => entry.name);

const indexSource = readFileSync(join(srcDir, 'index.ts'), 'utf8');
const stylesSource = readFileSync(join(srcDir, 'styles.css'), 'utf8');

describe('component conventions (C1)', () => {
  it('finds at least one component folder', () => {
    expect(components.length).toBeGreaterThan(0);
  });

  describe.each(components)('%s', (name) => {
    it.each([`${name}.tsx`, `${name}.test.tsx`, `${name}.stories.tsx`, `${name}.css`, 'index.ts'])(
      'has %s',
      (file) => {
        expect(existsSync(join(srcDir, name, file))).toBe(true);
      },
    );

    it('is exported in src/index.ts', () => {
      expect(indexSource).toMatch(new RegExp(`from\\s+['"]\\./${name}['"]`));
    });

    it('has its CSS imported in src/styles.css', () => {
      expect(stylesSource).toMatch(new RegExp(`@import\\s+['"]\\./${name}/${name}\\.css['"]`));
    });

    it('has a story exported as DarkTheme', () => {
      const file = join(srcDir, name, `${name}.stories.tsx`);
      const source = existsSync(file) ? readFileSync(file, 'utf8') : '';
      expect(source).toMatch(/export\s+const\s+DarkTheme\b/);
    });
  });
});
