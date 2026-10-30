import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Pagination.css'), 'utf8');

describe('Pagination.css', () => {
  it('sizes the buttons with space tokens for both sizes', () => {
    expect(css).toMatch(/\.ds-pagination \.ds-pagination__button\s*\{[^}]*var\(--ds-space-10\)/);
    expect(css).toMatch(/\[data-size='sm'\] \.ds-pagination__button\s*\{[^}]*var\(--ds-space-8\)/);
  });

  it('has no fixed colours or lengths', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/\b\d+(px|rem|em)\b/);
  });
});
