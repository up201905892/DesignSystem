import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Switch.css'), 'utf8');
const motion = readFileSync(resolve(__dirname, '../styles/motion.css'), 'utf8');
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

describe('Switch.css contrast (WCAG 1.4.11, enabled states)', () => {
  it.each([
    ['light', ':root,\n[data-theme="light"]'],
    ['dark', '[data-theme="dark"]'],
  ])('track and thumb reach 3:1 in the %s theme', (_name, selector) => {
    const t = themeTokens(selector);
    const track = {
      off: t['border-strong'] as string,
      on: t['accent-default'] as string,
      onHover: t['accent-hover'] as string,
    };
    for (const bg of ['bg-canvas', 'bg-surface']) {
      const page = t[bg] as string;
      expect(contrast(track.off, page), `off track on ${bg}`).toBeGreaterThanOrEqual(3);
      expect(contrast(track.on, page), `on track on ${bg}`).toBeGreaterThanOrEqual(3);
      expect(contrast(track.onHover, page), `hovered on track on ${bg}`).toBeGreaterThanOrEqual(3);
    }
    expect(
      contrast(t['bg-surface'] as string, track.off),
      'off thumb on track',
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrast(t['text-on-accent'] as string, track.on),
      'on thumb on track',
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrast(t['text-on-accent'] as string, track.onHover),
      'on thumb on hovered track',
    ).toBeGreaterThanOrEqual(3);
  });

  it('uses the tokens this test assumes', () => {
    expect(css).toContain('background-color: var(--ds-color-border-strong)');
    expect(css).toContain('background-color: var(--ds-color-accent-default)');
    expect(css).toContain('background-color: var(--ds-color-bg-surface)');
    expect(css).toContain('background-color: var(--ds-color-text-on-accent)');
  });
});

describe('Switch.css state and motion', () => {
  it('moves the thumb when checked, so state is not conveyed by colour alone', () => {
    expect(css).toMatch(
      /\[data-state='checked'\] \.ds-switch__thumb \{[^}]*transform: translateX\(/,
    );
  });

  it('animates only through transitions that the reduced-motion rule zeroes', () => {
    expect(css).toContain('transition: transform var(--ds-duration-fast)');
    expect(motion).toContain('prefers-reduced-motion: reduce');
    expect(motion).toContain('transition-duration: 0s !important');
    expect(motion).toContain("[class*=' ds-']");
  });

  it('has a visible focus ring', () => {
    expect(css).toMatch(
      /\.ds-switch__control:focus-visible \{[^}]*outline: 2px solid var\(--ds-color-focus-ring\)/,
    );
  });
});
