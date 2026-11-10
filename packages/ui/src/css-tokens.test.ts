import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const srcDir = import.meta.dirname;

function cssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith('.css') ? [path] : [];
  });
}

const files = cssFiles(srcDir);
const literalLength = /(^|[^\w-])-?\d*\.?\d+(px|rem|em)\b/;

describe('border and outline widths use tokens (DS-052)', () => {
  it('finds the component stylesheets', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files.map((file) => [file.slice(srcDir.length + 1), file]))('%s', (_name, file) => {
    const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const offenders = [...source.matchAll(/(?:^|[;{\s])((?:border|outline)[\w-]*)\s*:\s*([^;}]+)/g)]
      .filter(
        ([, property]) => property !== 'border-radius' && !property?.startsWith('border-radius'),
      )
      .filter(([, , value]) => literalLength.test(value ?? ''))
      .map(([, property, value]) => `${property}: ${value}`);
    expect(offenders).toEqual([]);
  });
});
