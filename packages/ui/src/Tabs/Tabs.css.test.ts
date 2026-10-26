import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Tabs.css'), 'utf8');

describe('Tabs.css', () => {
  it('marks the active tab with an accent indicator bar', () => {
    expect(css).toMatch(
      /\[data-state='active'\]\s*\{[^}]*border-bottom-color: var\(--ds-color-accent-default\)/,
    );
  });

  it('scrolls the list horizontally', () => {
    expect(css).toContain('overflow-x: auto');
  });

  it('has focus-visible styles for tabs and panels', () => {
    expect(css).toContain('.ds-tabs__trigger:focus-visible');
    expect(css).toContain('.ds-tabs__content:focus-visible');
  });

  it('has no fixed colours or lengths other than 1px and 2px', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    const lengths = css.match(/\b\d+(px|rem|em)\b/g) ?? [];
    expect(lengths.every((l) => ['1px', '2px'].includes(l))).toBe(true);
  });
});
