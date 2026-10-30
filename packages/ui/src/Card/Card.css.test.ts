import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Card.css'), 'utf8');

describe('Card.css', () => {
  it('uses the surface, border, radius and shadow tokens', () => {
    expect(css).toContain('var(--ds-color-bg-surface)');
    expect(css).toContain('1px solid var(--ds-color-border-default)');
    expect(css).toContain('var(--ds-radius-lg)');
    expect(css).toContain('var(--ds-shadow-md)');
  });

  it('has a focus-visible style for link cards', () => {
    expect(css).toContain('.ds-card:focus-visible');
  });

  it('has no fixed colours or lengths other than the 1px border and 2px focus ring', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    const lengths = css.match(/\d+(px|rem|em)\b/g) ?? [];
    expect(lengths.every((l) => l === '1px' || l === '2px')).toBe(true);
  });
});
