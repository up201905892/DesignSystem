import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Skeleton.css'), 'utf8');

describe('Skeleton.css', () => {
  it('removes the shimmer with prefers-reduced-motion', () => {
    const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(start).toBeGreaterThan(-1);
    const media = css.slice(start);
    expect(media).toContain('.ds-skeleton::after');
    expect(media).toContain('.ds-skeleton__line::after');
    expect(media).toMatch(/display:\s*none/);
    expect(media).toMatch(/animation:\s*none/);
  });

  it('reads size from the custom properties', () => {
    expect(css).toContain('width: var(--ds-skeleton-width');
    expect(css).toContain('var(--ds-skeleton-height');
  });

  it('uses no hard-coded colours', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });
});
