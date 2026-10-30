import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from './Table';

function header(
  direction?: 'asc' | 'desc' | 'none',
  extra: { sortable?: boolean; onSort?: () => void } = {},
) {
  return render(
    <Table aria-label="T">
      <TableHead>
        <TableRow>
          <TableHeaderCell sortable={extra.sortable ?? true} sortDirection={direction} {...extra}>
            Name
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow />
      </TableBody>
    </Table>,
  );
}

const icon = () => screen.getByRole('button', { name: 'Name' }).querySelector('svg')?.innerHTML;

describe('TableHeaderCell sorting (extra)', () => {
  it('shows a different icon for asc, desc and none', () => {
    const asc = header('asc');
    const ascIcon = icon();
    asc.unmount();
    const desc = header('desc');
    const descIcon = icon();
    desc.unmount();
    header('none');
    const noneIcon = icon();
    expect(new Set([ascIcon, descIcon, noneIcon]).size).toBe(3);
  });

  it('defaults a sortable header without sortDirection to aria-sort none', () => {
    header(undefined);
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
  });

  it('does not add a button or aria-sort when sortDirection is set without sortable', () => {
    header('asc', { sortable: false });
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('columnheader')).not.toHaveAttribute('aria-sort');
  });

  it('does not throw when sortable has no onSort', () => {
    header('none');
    expect(() => screen.getByRole('button', { name: 'Name' }).click()).not.toThrow();
  });

  it('forwards the ref to the th and keeps className', () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell ref={ref} sortable className="custom" onSort={vi.fn()}>
              Name
            </TableHeaderCell>
          </tr>
        </thead>
      </table>,
    );
    expect(ref.current?.tagName).toBe('TH');
    expect(ref.current).toHaveClass('ds-table__header-cell', 'custom');
  });
});
