import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const root = new URL('..', import.meta.url);
const css = readFileSync(new URL('dist/tokens.css', root), 'utf8');
const { tokens } = (await import(new URL('dist/index.js', root).href)) as {
  tokens: Record<string, unknown>;
};

function leaves(node: unknown, path: string[] = []): [string, unknown][] {
  if (node !== null && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => leaves(v, [...path, k]));
  }
  return [[path.join('.'), node]];
}

const cssVars = [...css.matchAll(/^\s*(--[\w-]+):\s*(.*?);$/gm)].map(
  (m) => [m[1], m[2]] as [string, string],
);

describe('primitive tokens', () => {
  const color = tokens.color as Record<string, Record<string, string>>;
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

  it.each(['neutral', 'primary', 'success', 'warning', 'danger', 'info'])(
    'palette %s has exactly the 10 steps',
    (name) => {
      expect(Object.keys(color[name] ?? {}).sort()).toEqual([...steps].sort());
    },
  );

  it('has white and black', () => {
    expect(color.white).toBe('#ffffff');
    expect(color.black).toBe('#000000');
  });

  it('spacing values are multiples of 4px', () => {
    const space = tokens.space as Record<string, string>;
    expect(Object.keys(space)).toEqual(['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16']);
    for (const value of Object.values(space)) {
      const px = value === '0' ? 0 : parseFloat(value) * 16;
      expect(px % 4).toBe(0);
    }
    expect(space['1']).toBe('0.25rem');
  });

  it('exposes the remaining categories', () => {
    const font = tokens.font as Record<string, Record<string, string>>;
    expect(Object.keys(font.family ?? {})).toEqual(['sans', 'mono']);
    expect(Object.keys(font.size ?? {})).toEqual(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']);
    expect(Object.keys(font.weight ?? {})).toEqual(['regular', 'medium', 'semibold', 'bold']);
    expect(Object.keys(font.lineHeight ?? {})).toEqual(['tight', 'normal', 'relaxed']);
    expect(Object.keys(tokens.radius as object)).toEqual(['none', 'sm', 'md', 'lg', 'full']);
    expect(Object.keys(tokens.shadow as object)).toEqual(['sm', 'md', 'lg']);
    expect(Object.keys(tokens.duration as object)).toEqual(['fast', 'normal']);
    expect(Object.keys(tokens.z as object)).toEqual([
      'dropdown',
      'overlay',
      'modal',
      'toast',
      'tooltip',
    ]);
  });
});

describe('generated output', () => {
  it('declares every variable under :root with the --ds- prefix', () => {
    expect(css).toContain(':root {');
    expect(cssVars.length).toBeGreaterThan(0);
    for (const [name] of cssVars) expect(name.startsWith('--ds-')).toBe(true);
    expect(cssVars).toContainEqual(['--ds-color-primary-500', '#3b82f6']);
    expect(cssVars).toContainEqual(['--ds-space-4', '1rem']);
  });

  it('CSS variable count equals the TypeScript leaf count', () => {
    expect(cssVars.length).toBe(leaves(tokens).length);
  });

  it('has no empty values or unresolved references', () => {
    for (const [name, value] of cssVars) {
      expect(value, name).not.toBe('');
      expect(value, name).not.toMatch(/[{}]/);
    }
    for (const [path, value] of leaves(tokens)) {
      expect(String(value), path).not.toBe('');
      expect(String(value), path).not.toMatch(/[{}]/);
    }
  });

  it('CJS build exports the same tokens as ESM', () => {
    const cjs = createRequire(import.meta.url)(new URL('dist/index.cjs', root).pathname) as {
      tokens: unknown;
    };
    expect(cjs.tokens).toEqual(tokens);
  });

  it('has one JSON source per category', () => {
    const files = readdirSync(new URL('src/primitives/', root)).filter((f) => f.endsWith('.json'));
    expect(files.length).toBe(7);
  });
});
