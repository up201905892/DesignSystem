import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Tooltip.css'), 'utf8');
const tokens = readFileSync(resolve(__dirname, '../../../tokens/dist/tokens.css'), 'utf8');
const themes = readFileSync(resolve(__dirname, '../../../tokens/dist/themes.css'), 'utf8');
const all = tokens + themes;

function themeTokens(selector: string): Record<string, string> {
  const start = themes.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`Theme not found: ${selector}`);
  const body = themes.slice(start, themes.indexOf('}', start));
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/--ds-color-([a-z-]+):\s*(#[0-9a-f]{6})/g)) {
    out[m[1] as string] = m[2] as string;
  }
  return out;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

describe('Tooltip.css', () => {
  it('uses only tokens that exist', () => {
    const used = new Set([...css.matchAll(/var\((--ds-[a-z0-9-]+)\)/g)].map((m) => m[1]));
    for (const name of used) {
      expect(all, `missing token ${name}`).toContain(`${name}:`);
    }
  });

  it('uses the tooltip z-index and limits the width with tokens', () => {
    expect(css).toMatch(/\.ds-tooltip\s*{[^}]*z-index:\s*var\(--ds-z-tooltip\)/);
    expect(css).toMatch(/max-width:[^;]*var\(--ds-space-16\)/);
    expect(css).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it('has no hard-coded colours', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });

  it.each(['[data-theme="light"]', '[data-theme="dark"]'])(
    'text has contrast of at least 4.5:1 on the background in %s',
    (selector) => {
      const t = themeTokens(selector);
      const [hi, lo] = [
        luminance(t['bg-canvas'] as string),
        luminance(t['bg-inverse'] as string),
      ].sort((a, b) => b - a) as [number, number];
      expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('animates only the entrance (reduced motion is handled by the global rule)', () => {
    expect(css).toMatch(/@keyframes ds-tooltip-in/);
    expect(css).not.toMatch(/data-state='closed'/);
  });
});
