import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'Dialog.css'), 'utf8');
const motion = readFileSync(resolve(__dirname, '../styles/motion.css'), 'utf8');
const tokens = readFileSync(resolve(__dirname, '../../../tokens/dist/tokens.css'), 'utf8');
const themes = readFileSync(resolve(__dirname, '../../../tokens/dist/themes.css'), 'utf8');
const all = tokens + themes;

describe('Dialog.css', () => {
  it('uses only tokens that exist', () => {
    const used = new Set([...css.matchAll(/var\((--ds-[a-z0-9-]+)\)/g)].map((m) => m[1]));
    const local = new Set([...css.matchAll(/(--ds-dialog-[a-z-]+):/g)].map((m) => m[1]));
    for (const name of used) {
      if (local.has(name)) continue;
      expect(all, `missing token ${name}`).toContain(`${name}:`);
    }
  });

  it('puts overlay and content on the modal z-index with the overlay colour', () => {
    expect(css).toMatch(/\.ds-dialog__overlay\s*{[^}]*z-index:\s*var\(--ds-z-modal\)/);
    expect(css).toMatch(
      /\.ds-dialog__overlay\s*{[^}]*background-color:\s*var\(--ds-color-overlay\)/,
    );
    expect(css).toMatch(/\.ds-dialog\s*{[^}]*z-index:\s*var\(--ds-z-modal\)/);
  });

  it('shrinks to the viewport on narrow screens with a token margin', () => {
    expect(css).toMatch(
      /width:\s*min\(var\(--ds-dialog-width\),\s*calc\(100vw - var\(--ds-space-8\)\)\)/,
    );
  });

  it('scrolls inside the body while header and footer stay fixed', () => {
    expect(css).toMatch(/\.ds-dialog__body\s*{[^}]*overflow-y:\s*auto/);
    expect(css).toMatch(/\.ds-dialog__header\s*{[^}]*flex:\s*0 0 auto/);
    expect(css).toMatch(/\.ds-dialog__footer\s*{[^}]*flex:\s*0 0 auto/);
    expect(css).toMatch(/max-height:\s*calc\(100dvh/);
  });

  it('has no hard-coded colours or lengths outside tokens', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/:\s*-?[\d.]+(rem|em)\b/);
  });

  it('has its animations covered by the reduced-motion rule', () => {
    expect(css).toMatch(/animation:/);
    expect(motion).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(motion).toMatch(/\[class\^='ds-'\]/);
    expect(motion).toMatch(/animation-duration:\s*0s !important/);
    // every Dialog class starts with "ds-", so the prefix selectors apply to it
    for (const m of css.matchAll(/^\.(ds-[a-z_-]+)/gm)) expect(m[1]).toMatch(/^ds-/);
  });

  it('shows a focus ring on the content', () => {
    expect(css).toMatch(/\.ds-dialog:focus-visible\s*{[^}]*--ds-color-focus-ring/);
  });
});
