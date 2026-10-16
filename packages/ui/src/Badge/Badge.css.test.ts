import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Badge.css'), 'utf8');
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

/** Reads the colour tokens that Badge.css assigns to --ds-badge-bg / --ds-badge-fg. */
function declared(selector: string, prop: 'bg' | 'fg'): string | undefined {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) return undefined;
  const body = css.slice(start, css.indexOf('}', start));
  return body.match(new RegExp(`--ds-badge-${prop}: var\\(--ds-color-([a-z-]+)\\)`))?.[1];
}

function colours(variant: string, appearance: string): { bg: string; fg: string } {
  const app = `.ds-badge[data-appearance='${appearance}']`;
  const full = `${app}[data-variant='${variant}']`;
  const bg = declared(full, 'bg');
  const fg = declared(full, 'fg') ?? declared(app, 'fg');
  if (!bg || !fg) throw new Error(`Missing colours for ${variant} ${appearance}`);
  return { bg, fg };
}

describe('Badge.css contrast (text >= 4.5:1, 12 combinations per theme)', () => {
  it.each([
    ['light', ':root,\n[data-theme="light"]'],
    ['dark', '[data-theme="dark"]'],
  ])('%s theme', (_name, selector) => {
    const t = themeTokens(selector);
    for (const variant of ['neutral', 'primary', 'success', 'warning', 'danger', 'info']) {
      for (const appearance of ['subtle', 'solid']) {
        const { bg, fg } = colours(variant, appearance);
        expect(t[bg], `token ${bg}`).toBeDefined();
        expect(t[fg], `token ${fg}`).toBeDefined();
        expect(
          contrast(t[fg] as string, t[bg] as string),
          `${variant} ${appearance}: ${fg} on ${bg}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('keeps long text on one line, cut with an ellipsis', () => {
    expect(css).toMatch(/white-space: nowrap/);
    expect(css).toMatch(/text-overflow: ellipsis/);
    expect(css).toMatch(/max-width: 100%/);
  });
});
