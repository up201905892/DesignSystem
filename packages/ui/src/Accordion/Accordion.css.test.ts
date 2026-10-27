import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Accordion.css'), 'utf8');

describe('Accordion.css', () => {
  it('rotates the chevron when the item is open', () => {
    expect(css).toMatch(/\[data-state='open'\] \.ds-accordion__icon\s*\{[^}]*rotate\(180deg\)/);
  });

  it('animates the height with the Radix variable', () => {
    expect(css).toContain('var(--radix-accordion-content-height)');
  });

  it('turns off rotation and height animation for reduced motion', () => {
    const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(block).toContain('transition: none');
    expect(block).toContain('animation: none');
  });

  it('has focus-visible styles for the trigger', () => {
    expect(css).toContain('.ds-accordion__trigger:focus-visible');
  });

  it('has no fixed colours or lengths other than 1px and 2px', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    const lengths = css.match(/\b\d+(px|rem|em)\b/g) ?? [];
    expect(lengths.every((l) => ['1px', '2px'].includes(l))).toBe(true);
  });
});
