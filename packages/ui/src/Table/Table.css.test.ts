import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Table.css'), 'utf8');
const tokens = readFileSync(resolve(__dirname, '../../../tokens/dist/tokens.css'), 'utf8');
const themes = readFileSync(resolve(__dirname, '../../../tokens/dist/themes.css'), 'utf8');
const all = tokens + themes;

describe('Table.css', () => {
  it('uses only tokens that exist', () => {
    const used = new Set([...css.matchAll(/var\((--ds-[a-z0-9-]+)[,)]/g)].map((m) => m[1]));
    for (const name of used) {
      // Custom properties defined by the table itself or set by the consumer.
      if (!name || name.startsWith('--ds-table-')) continue;
      expect(all, `missing token ${name}`).toContain(`${name}:`);
    }
  });

  it('scrolls inside the container', () => {
    expect(css).toMatch(/\.ds-table-container\s*{[^}]*overflow:\s*auto/);
  });

  it('uses tabular figures for numeric cells', () => {
    expect(css).toMatch(/\[data-numeric='true'\]\s*{[^}]*tabular-nums/);
  });

  it('has no hard-coded colours', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });
});
