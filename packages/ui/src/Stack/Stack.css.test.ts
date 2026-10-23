import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Stack.css'), 'utf8');
const tokens = readFileSync(resolve(__dirname, '../../../tokens/dist/tokens.css'), 'utf8');

describe('Stack.css', () => {
  it('maps every gap key to an existing space token', () => {
    for (const key of [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16]) {
      expect(css).toContain(`.ds-stack[data-gap='${key}'] {\n  gap: var(--ds-space-${key});`);
      expect(tokens).toContain(`--ds-space-${key}:`);
    }
  });

  it('never reorders the children', () => {
    expect(css).not.toMatch(/\border\s*:/);
    expect(css).not.toMatch(/row-reverse|column-reverse/);
  });

  it('has no fixed lengths or colours', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\d(px|rem|em)\b/i);
  });
});
