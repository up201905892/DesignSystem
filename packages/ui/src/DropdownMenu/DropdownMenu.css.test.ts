import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'DropdownMenu.css'), 'utf8');
const tokens = readFileSync(resolve(__dirname, '../../../tokens/dist/tokens.css'), 'utf8');
const themes = readFileSync(resolve(__dirname, '../../../tokens/dist/themes.css'), 'utf8');
const all = tokens + themes;

describe('DropdownMenu.css', () => {
  it('uses only tokens that exist', () => {
    const used = new Set([...css.matchAll(/var\((--ds-[a-z0-9-]+)\)/g)].map((m) => m[1]));
    for (const name of used) {
      expect(all, `missing token ${name}`).toContain(`${name}:`);
    }
  });

  it('puts the panel on the dropdown z-index', () => {
    expect(css).toMatch(/\.ds-dropdown-menu\s*{[^}]*z-index:\s*var\(--ds-z-dropdown\)/);
  });

  it('highlights by data-highlighted and styles the danger variant with the danger tokens', () => {
    expect(css).toMatch(/\.ds-dropdown-menu__item\[data-highlighted\]/);
    expect(css).toMatch(/\[data-variant='danger'\]\s*{[^}]*color:\s*var\(--ds-color-danger-text\)/);
  });

  it('has no hard-coded colours', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });
});
