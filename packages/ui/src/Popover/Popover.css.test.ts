import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Popover.css'), 'utf8');
const tokens = readFileSync(resolve(__dirname, '../../../tokens/dist/tokens.css'), 'utf8');
const themes = readFileSync(resolve(__dirname, '../../../tokens/dist/themes.css'), 'utf8');
const all = tokens + themes;

describe('Popover.css', () => {
  it('uses only tokens that exist', () => {
    const used = new Set([...css.matchAll(/var\((--ds-[a-z0-9-]+)\)/g)].map((m) => m[1]));
    for (const name of used) {
      expect(all, `missing token ${name}`).toContain(`${name}:`);
    }
  });

  it('uses the dropdown z-index and never exceeds the viewport width', () => {
    expect(css).toMatch(/\.ds-popover\s*{[^}]*z-index:\s*var\(--ds-z-dropdown\)/);
    expect(css).toMatch(/max-width:[^;]*100vw/);
  });

  it('has no hard-coded colours', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });

  it('animates only the entrance (reduced motion is handled by the global rule)', () => {
    expect(css).toMatch(/@keyframes ds-popover-in/);
    expect(css).not.toMatch(/data-state='closed'/);
  });
});
