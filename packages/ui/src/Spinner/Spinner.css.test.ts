import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Spinner.css'), 'utf8');

describe('Spinner.css', () => {
  it('rotates by default and stops with prefers-reduced-motion', () => {
    expect(css).toMatch(/\.ds-spinner__graphic\s*\{[^}]*animation:[^;]*infinite/);
    const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(start).toBeGreaterThan(-1);
    const media = css.slice(start);
    expect(media).toMatch(/\.ds-spinner__graphic\s*\{[^}]*animation:\s*none/);
    expect(media).not.toMatch(/display:\s*none|visibility:\s*hidden|opacity:\s*0\b/);
  });

  it('draws with currentColor only', () => {
    expect(css).toMatch(/stroke:\s*currentcolor/i);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });

  it.each([
    ['sm', '--ds-space-4'],
    ['md', '--ds-space-6'],
    ['lg', '--ds-space-8'],
  ])('size %s uses the token %s', (size, token) => {
    const re = new RegExp(
      `data-size='${size}'\\]\\s*\\{\\s*--ds-spinner-size:\\s*var\\(${token}\\)`,
    );
    expect(css).toMatch(re);
  });
});
