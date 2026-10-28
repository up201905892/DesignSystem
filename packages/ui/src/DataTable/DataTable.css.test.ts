import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'DataTable.css'), 'utf8');

describe('DataTable.css', () => {
  it('lays out the footer with space and text tokens', () => {
    expect(css).toMatch(/\.ds-data-table__footer\s*\{[^}]*var\(--ds-space-4\)/);
    expect(css).toMatch(/\.ds-data-table__summary\s*\{[^}]*var\(--ds-color-text-muted\)/);
  });

  it('has no fixed colours or lengths', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/\b\d+(px|rem|em)\b/);
  });
});
