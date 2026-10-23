import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Toast.css'), 'utf8');
const tokens = readFileSync(resolve(__dirname, '../../../tokens/dist/tokens.css'), 'utf8');
const themes = readFileSync(resolve(__dirname, '../../../tokens/dist/themes.css'), 'utf8');
const all = tokens + themes;

describe('Toast.css', () => {
  it('uses only tokens that exist', () => {
    const used = new Set(
      [...css.matchAll(/var\((--ds-[a-z0-9-]+)\)/g)]
        .map((m) => m[1]!)
        .filter((name) => !name.startsWith('--ds-toast-')),
    );
    for (const name of used) {
      expect(all, `missing token ${name}`).toContain(`${name}:`);
    }
  });

  it('puts the region on the toast z-index', () => {
    expect(css).toMatch(/\.ds-toast-viewport\s*{[^}]*z-index:\s*var\(--ds-z-toast\)/);
  });

  it('fills the available width on narrow screens', () => {
    expect(css).toMatch(/--ds-toast-width:[^;]*100vw/);
  });

  it('has no hard-coded colours', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });

  it('has entrance and exit animations (reduced motion is handled by the global rule)', () => {
    expect(css).toMatch(/@keyframes ds-toast-in/);
    expect(css).toMatch(/@keyframes ds-toast-out/);
  });
});
