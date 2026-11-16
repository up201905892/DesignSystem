import { describe, expect, it } from 'vitest';
import { reflowExceptions } from '../.storybook/a11y-checks';
import page from './accessibility.mdx?raw';
import indexSource from '../../../packages/ui/src/index.ts?raw';

/** Runtime exports of `packages/ui/src/index.ts` (the `export type { ... }` lines are skipped). */
const runtimeExports = [...indexSource.matchAll(/^export\s+\{([^}]*)\}\s+from/gm)].flatMap(
  (match) =>
    (match[1] ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
);

describe('Accessibility/Conformance page', () => {
  it('reads the exports of the package', () => {
    expect(runtimeExports.length).toBeGreaterThan(40);
    expect(runtimeExports).toContain('Button');
    expect(runtimeExports).toContain('DataTable');
  });

  it.each(runtimeExports)('has a row for the export %s', (name) => {
    const rows = page.split('\n').filter((line) => line.startsWith('| `'));
    expect(rows.some((row) => row.includes(`\`${name}\``))).toBe(true);
  });

  it('has a table with the six columns', () => {
    const header = page.split('\n').find((line) => line.startsWith('| Component')) ?? '';
    const cells = header
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);
    expect(cells).toEqual([
      'Component',
      'ARIA roles and attributes',
      'APG pattern',
      'Keys',
      'WCAG 2.1 AA',
      'Verified by',
    ]);
  });

  it('is a documentation page with the agreed title', () => {
    expect(page).toContain('<Meta title="Accessibility/Conformance" />');
  });

  it('mentions focusableWhenDisabled for Button, IconButton and Pagination', () => {
    const rowOf = (name: string) =>
      page.split('\n').find((line) => line.startsWith(`| \`${name}\``)) ?? '';
    for (const name of ['Button', 'IconButton', 'Pagination']) {
      expect(rowOf(name)).toContain('focusableWhenDisabled');
    }
  });

  it('refers to the userEvent play functions and to the DataTable review', () => {
    expect(page).toContain('`play` with `userEvent`');
    expect(page).toContain('## Visual review of the DataTable');
    expect(page).toContain('`LiveSummary`');
  });

  it('lists and justifies every reflow exception', () => {
    for (const [id, reason] of Object.entries(reflowExceptions)) {
      expect(page, id).toContain(id);
      expect(reason.length).toBeGreaterThan(10);
    }
    if (Object.keys(reflowExceptions).length === 0) {
      expect(page).toContain('Exceptions: none.');
    }
  });

  it('states the 24px target exceptions and the limits', () => {
    expect(page).toContain('Links inside a sentence');
    expect(page).toContain('## Known limitations');
  });

  it('has no placeholders', () => {
    expect(page).not.toMatch(/TODO|lorem ipsum|TBD/i);
  });
});
