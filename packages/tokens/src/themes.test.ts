import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('..', import.meta.url);
const themesCss = readFileSync(new URL('dist/themes.css', root), 'utf8');
const { tokens, themes } = (await import(new URL('dist/index.js', root).href)) as {
  tokens: Record<string, unknown>;
  themes: Record<'light' | 'dark', Record<string, unknown>>;
};

function leaves(node: unknown, path: string[] = []): [string, unknown][] {
  if (node !== null && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => leaves(v, [...path, k]));
  }
  return [[path.join('-'), node]];
}

const light = Object.fromEntries(leaves(themes.light));
const dark = Object.fromEntries(leaves(themes.dark));

const required = [
  'color-bg-canvas',
  'color-bg-surface',
  'color-bg-subtle',
  'color-bg-inverse',
  'color-text-default',
  'color-text-muted',
  'color-text-disabled',
  'color-text-on-accent',
  'color-border-default',
  'color-border-strong',
  'color-accent-default',
  'color-accent-hover',
  'color-accent-active',
  'color-accent-subtle',
  ...['success', 'warning', 'danger', 'info'].flatMap((s) => [
    `color-${s}-default`,
    `color-${s}-subtle`,
    `color-${s}-text`,
  ]),
  'color-focus-ring',
  'color-overlay',
];

/** Declarations of the block that starts with `selector` (first match). */
function block(css: string, selector: string): string {
  const start = css.indexOf(selector);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('semantic sources', () => {
  const dir = new URL('src/semantic/', root);

  it.each(['light', 'dark'])('%s.json only references primitives', (name) => {
    const json = JSON.parse(readFileSync(new URL(`${name}.json`, dir), 'utf8')) as unknown;
    const values = JSON.stringify(json).match(/"value":\s*"([^"]*)"/g) ?? [];
    expect(values.length).toBeGreaterThan(0);
    for (const v of values) expect(v).toMatch(/"\{color\.[\w.-]+\}"$/);
    expect(JSON.stringify(json)).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgb|hsl/);
  });

  it('has exactly one light and one dark source', () => {
    expect(readdirSync(dir).sort()).toEqual(['dark.json', 'light.json']);
  });
});

describe('theme tokens', () => {
  it('both themes have exactly the same set of keys', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it('contains every required semantic token', () => {
    for (const name of required) {
      expect(light, name).toHaveProperty([name]);
      expect(dark, name).toHaveProperty([name]);
    }
  });

  it('has no empty values or unresolved references', () => {
    for (const set of [light, dark]) {
      for (const [name, value] of Object.entries(set)) {
        expect(String(value), name).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/);
      }
    }
  });

  it('does not change the primitive tokens', () => {
    expect(Object.keys((tokens.color as Record<string, unknown>).success as object)).toHaveLength(
      10,
    );
  });
});

describe('themes.css', () => {
  it('contains the three theme selectors', () => {
    expect(themesCss).toContain(':root,\n[data-theme="light"] {');
    expect(themesCss).toContain('[data-theme="dark"] {');
    expect(themesCss).toContain('@media (prefers-color-scheme: dark) {');
    expect(themesCss).toContain(':root:not([data-theme="light"]) {');
  });

  it('defines color-scheme in each block', () => {
    expect(block(themesCss, '[data-theme="light"] {')).toContain('color-scheme: light;');
    expect(block(themesCss, '[data-theme="dark"] {')).toContain('color-scheme: dark;');
    expect(block(themesCss, ':root:not([data-theme="light"]) {')).toContain('color-scheme: dark;');
  });

  it('defines the same variables in every block, with the --ds- prefix', () => {
    const names = (css: string) =>
      [...css.matchAll(/(--[\w-]+):/g)].map((m) => m[1] as string).sort();
    const lightNames = names(block(themesCss, '[data-theme="light"] {'));
    expect(lightNames.length).toBe(required.length);
    for (const n of lightNames) expect(n.startsWith('--ds-')).toBe(true);
    expect(names(block(themesCss, '[data-theme="dark"] {'))).toEqual(lightNames);
    expect(names(block(themesCss, ':root:not([data-theme="light"]) {'))).toEqual(lightNames);
  });

  it('the system-preference fallback matches the dark theme values', () => {
    const decl = (css: string) =>
      [...css.matchAll(/(--[\w-]+):\s*(.*?);/g)].map((m) => `${m[1]}:${m[2]}`);
    expect(decl(block(themesCss, ':root:not([data-theme="light"]) {'))).toEqual(
      decl(block(themesCss, '[data-theme="dark"] {')),
    );
  });
});
