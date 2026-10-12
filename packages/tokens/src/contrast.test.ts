import { describe, expect, it } from 'vitest';
import { MIN_RATIO, contrastPairs } from './contrast-pairs';

const { themes } = (await import(new URL('../dist/index.js', import.meta.url).href)) as {
  themes: Record<'light' | 'dark', { color: Record<string, Record<string, string> | string> }>;
};

/** Looks up `color-bg-canvas` style names in the nested theme object. */
function lookup(theme: 'light' | 'dark', name: string): string {
  const parts = name.split('-');
  // Keys may contain dashes (e.g. `on-accent`), so try every split point.
  const walk = (node: unknown, rest: string[]): string | undefined => {
    if (typeof node === 'string') return rest.length === 0 ? node : undefined;
    if (node === null || typeof node !== 'object') return undefined;
    for (let i = 1; i <= rest.length; i++) {
      const child = (node as Record<string, unknown>)[rest.slice(0, i).join('-')];
      const found = child === undefined ? undefined : walk(child, rest.slice(i));
      if (found) return found;
    }
    return undefined;
  };
  const value = walk(themes[theme], parts);
  if (!value) throw new Error(`Unknown token ${name} in theme ${theme}`);
  return value;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio between two opaque hex colours. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe('contrast helper', () => {
  it('computes the known WCAG extremes', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });
});

describe('contrast pairs', () => {
  it('covers the pairs required by the spec', () => {
    const has = (fg: string, bg: string) => contrastPairs.some((p) => p.fg === fg && p.bg === bg);
    for (const fg of ['color-text-default', 'color-text-muted']) {
      for (const bg of ['color-bg-canvas', 'color-bg-surface']) expect(has(fg, bg)).toBe(true);
    }
    for (const s of ['success', 'warning', 'danger', 'info']) {
      for (const bg of ['color-bg-canvas', 'color-bg-surface', `color-${s}-subtle`]) {
        expect(has(`color-${s}-text`, bg)).toBe(true);
      }
    }
    for (const step of ['default', 'hover', 'active']) {
      expect(has('color-text-on-accent', `color-accent-${step}`)).toBe(true);
    }
    expect(has('color-border-strong', 'color-bg-canvas')).toBe(true);
    expect(has('color-focus-ring', 'color-bg-canvas')).toBe(true);
  });

  describe.each(['light', 'dark'] as const)('%s theme', (theme) => {
    it.each(contrastPairs.map((p) => [`${p.fg} on ${p.bg}`, p] as const))('%s', (_, pair) => {
      const ratio = contrastRatio(lookup(theme, pair.fg), lookup(theme, pair.bg));
      expect(ratio).toBeGreaterThanOrEqual(MIN_RATIO[pair.kind]);
    });
  });
});
