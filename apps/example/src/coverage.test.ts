import { describe, expect, it } from 'vitest';
import * as ui from '@up201905892/ui';

/**
 * Exports that the example app does not need to import, each with the reason.
 * Everything else exported as a component or hook must be imported in `apps/example/src`.
 */
const EXCEPTIONS: Record<string, string> = {
  // Parts of the table that `DataTable` already composes for the app.
  Table: 'composed by DataTable',
  TableCaption: 'composed by DataTable',
  TableHead: 'composed by DataTable',
  TableBody: 'composed by DataTable',
  TableRow: 'composed by DataTable',
  TableHeaderCell: 'composed by DataTable',
  TableCell: 'composed by DataTable',
  useTableSort: 'used inside DataTable',
  Pagination: 'composed by DataTable',
  usePagination: 'used inside DataTable',
  // Low-level helpers with no use in this app.
  useFieldControl: 'for building custom controls; the app uses the ready-made ones',
  CardDescription: 'the Overview cards only have a title and a body',
  CardFooter: 'the Overview cards only have a title and a body',
  GridItem: 'the Overview grid does not need to place items',
  DropdownMenuGroup: 'the menus in the app have a single group',
  SelectGroup: 'the assignee list has no groups',
  SelectSeparator: 'the assignee list has no groups',
};

const sources = import.meta.glob<string>(['./**/*.{ts,tsx}', '!./**/*.test.{ts,tsx}'], {
  query: '?raw',
  import: 'default',
  eager: true,
});
const code = Object.values(sources).join('\n');

/** Names imported from the library: the part of each `import { ... } from '@up201905892/ui'`. */
const imported = new Set<string>();
for (const match of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*'@up201905892\/ui'/g)) {
  for (const part of (match[1] ?? '').split(',')) {
    const name = part.trim().replace(/^type\s+/, '');
    if (name && !part.trim().startsWith('type ')) imported.add(name.split(/\s+as\s+/)[0] ?? name);
  }
}

describe('library coverage', () => {
  const exported = Object.keys(ui);

  it('exports something to check', () => {
    expect(exported.length).toBeGreaterThan(30);
  });

  it('imports every component and hook of @up201905892/ui in apps/example/src', () => {
    const missing = exported.filter((name) => !imported.has(name) && !(name in EXCEPTIONS));
    expect(missing).toEqual([]);
  });

  it('keeps the exceptions list honest: every exception exists and is really unused', () => {
    for (const name of Object.keys(EXCEPTIONS)) {
      expect(exported, `${name} is not exported any more`).toContain(name);
      expect(imported.has(name), `${name} is used, remove it from EXCEPTIONS`).toBe(false);
    }
  });
});
