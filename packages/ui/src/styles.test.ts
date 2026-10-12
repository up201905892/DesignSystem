import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const pkg = process.cwd();
let css = '';

describe('dist/styles.css', () => {
  beforeAll(() => {
    execFileSync('node', ['scripts/build-css.mjs'], { cwd: pkg });
    css = readFileSync(resolve(pkg, 'dist/styles.css'), 'utf8');
  });

  it('includes the token and theme variables', () => {
    expect(css).toContain('--ds-color-bg-canvas');
    expect(css).toContain('[data-theme="dark"]');
  });

  it('includes the common focus ring and the reduced-motion rule', () => {
    expect(css).toContain(':focus-visible');
    expect(css).toContain('prefers-reduced-motion: reduce');
  });

  it('has no unresolved @import', () => {
    expect(css).not.toContain('@import');
  });

  it('keeps the order tokens, themes, base, focus, motion', () => {
    const order = [
      ':root {',
      '[data-theme="dark"]',
      'box-sizing: border-box',
      ':focus-visible',
      'prefers-reduced-motion',
    ].map((marker) => css.indexOf(marker));
    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
});
