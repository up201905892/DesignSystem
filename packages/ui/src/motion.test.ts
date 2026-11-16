import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * WCAG 2.3.3 (DS-040): every `animation` and `transition` in the component CSS is covered by the
 * `prefers-reduced-motion` rule of `styles/motion.css`. That rule matches any element with a class
 * that starts with `ds-` (and its `::before` and `::after`), so each rule that animates has to
 * select such an element.
 */
const srcDir = import.meta.dirname;

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith('.css') ? [path] : [];
  });
}

const files = cssFiles(srcDir).filter((file) => !file.endsWith('motion.css'));
const motionCss = readFileSync(join(srcDir, 'styles', 'motion.css'), 'utf8');
const stylesCss = readFileSync(join(srcDir, 'styles.css'), 'utf8');

interface Occurrence {
  file: string;
  selector: string;
  declaration: string;
}

function occurrences(): Occurrence[] {
  const found: Occurrence[] = [];
  for (const file of files) {
    const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = (match[1] ?? '').trim();
      if (/^(from|to|\d+%)/.test(selector)) continue;
      for (const declaration of (match[2] ?? '').split(';')) {
        if (/^\s*(animation|transition)(-[a-z-]+)?\s*:/.test(declaration)) {
          found.push({
            file: file.slice(srcDir.length + 1),
            selector,
            declaration: declaration.trim(),
          });
        }
      }
    }
  }
  return found;
}

describe('prefers-reduced-motion (WCAG 2.3.3)', () => {
  it('has a reduced-motion rule that disables animation and transition durations', () => {
    expect(motionCss).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(motionCss).toMatch(/animation-duration:\s*0s\s*!important/);
    expect(motionCss).toMatch(/transition-duration:\s*0s\s*!important/);
    expect(motionCss).toMatch(/\[class\^='ds-'\]/);
    expect(motionCss).toMatch(/\[class\*=' ds-'\]/);
  });

  it('is part of styles.css', () => {
    expect(stylesCss).toMatch(/@import\s+['"]\.\/styles\/motion\.css['"]/);
  });

  it('finds the animations and transitions of the components', () => {
    expect(occurrences().length).toBeGreaterThan(10);
  });

  it.each(occurrences().map((item) => [`${item.file}: ${item.selector}`, item] as const))(
    '%s is covered by the rule',
    (_name, item) => {
      for (const part of item.selector.split(',')) {
        expect(part, item.declaration).toMatch(/\.ds-[a-z]/);
      }
    },
  );
});
