import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Alert.css'), 'utf8');
const themes = readFileSync(resolve(__dirname, '../../../tokens/dist/themes.css'), 'utf8');

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

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

function declared(selector: string, prop: 'bg' | 'fg'): string | undefined {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) return undefined;
  const body = css.slice(start, css.indexOf('}', start));
  return body.match(new RegExp(`--ds-alert-${prop}: var\\(--ds-color-([a-z-]+)\\)`))?.[1];
}

describe('Alert.css contrast (text and icon on the -subtle background)', () => {
  it.each([
    ['light', ':root,\n[data-theme="light"]'],
    ['dark', '[data-theme="dark"]'],
  ])('%s theme', (_name, selector) => {
    const t = themeTokens(selector);
    for (const variant of ['info', 'success', 'warning', 'danger']) {
      const sel = variant === 'info' ? '.ds-alert' : `.ds-alert[data-variant='${variant}']`;
      const bg = declared(sel, 'bg');
      const fg = declared(sel, 'fg');
      if (!bg || !fg) throw new Error(`Missing colours for ${variant}`);
      expect(
        contrast(t[fg] as string, t[bg] as string),
        `${variant}: ${fg} on ${bg}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
