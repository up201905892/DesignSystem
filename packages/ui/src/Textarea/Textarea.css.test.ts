import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const textarea = readFileSync(resolve(__dirname, 'Textarea.css'), 'utf8');
const input = readFileSync(resolve(__dirname, '../Input/Input.css'), 'utf8');

function block(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css);
  if (!match) throw new Error(`Selector not found: ${selector}`);
  return match[1] ?? '';
}

describe('Textarea.css', () => {
  it.each([
    ['sm', '--ds-space-8'],
    ['md', '--ds-space-10'],
    ['lg', '--ds-space-12'],
  ])('uses min-height (not height) for size %s', (size, token) => {
    const rules = block(textarea, `.ds-textarea[data-size='${size}']`);
    expect(rules).toContain(`min-height: var(${token})`);
    expect(rules).not.toMatch(/(^|[\s;])height:/);
  });

  it.each(['sm', 'md', 'lg'])('matches the Input font size and padding for size %s', (size) => {
    const t = block(textarea, `.ds-textarea[data-size='${size}']`);
    const i = block(input, `.ds-input[data-size='${size}']`);
    for (const prop of ['font-size', 'padding-inline']) {
      const re = new RegExp(`${prop}:[^;]+;`);
      expect(re.exec(t)?.[0]).toBe(re.exec(i)?.[0]);
    }
  });

  it('shares the base border, radius and vertical padding with Input', () => {
    const t = block(textarea, '.ds-textarea');
    const i = block(input, '.ds-input');
    for (const prop of [
      'border',
      'border-radius',
      'padding-block',
      'padding-inline',
      'line-height',
    ]) {
      const re = new RegExp(`(^|[\\s;])${prop}:[^;]+;`);
      expect(re.exec(t)?.[0]).toBe(re.exec(i)?.[0]);
    }
  });

  it('has no hard-coded colors', () => {
    expect(textarea).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/);
  });
});
