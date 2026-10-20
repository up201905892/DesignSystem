import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table';
import { useTableSort } from './useTableSort';

function SortTable({ onSort = () => {} }: { onSort?: () => void }) {
  return (
    <Table aria-label="Sortable">
      <TableHead>
        <TableRow>
          <TableHeaderCell sortable sortDirection="asc" onSort={onSort}>
            Name
          </TableHeaderCell>
          <TableHeaderCell sortable sortDirection="desc">
            Age
          </TableHeaderCell>
          <TableHeaderCell sortable>Team</TableHeaderCell>
          <TableHeaderCell>Plain</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>36</TableCell>
          <TableCell>A</TableCell>
          <TableCell>x</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('TableHeaderCell sorting', () => {
  it('reflects sortDirection in aria-sort', () => {
    render(<SortTable />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(screen.getByRole('columnheader', { name: 'Team' })).toHaveAttribute('aria-sort', 'none');
  });

  it('has no button or aria-sort on non-sortable headers', () => {
    render(<SortTable />);
    const plain = screen.getByRole('columnheader', { name: 'Plain' });
    expect(plain).not.toHaveAttribute('aria-sort');
    expect(plain.querySelector('button')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('calls onSort on click, Enter and Space, keeping the focus', async () => {
    const onSort = vi.fn();
    const user = userEvent.setup();
    render(<SortTable onSort={onSort} />);
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSort).toHaveBeenCalledTimes(1);
    await user.keyboard('{Enter}');
    expect(onSort).toHaveBeenCalledTimes(2);
    await user.keyboard(' ');
    expect(onSort).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('button', { name: 'Name' })).toHaveFocus();
  });

  it('tabs through the sort buttons in column order', async () => {
    const user = userEvent.setup();
    render(<SortTable />);
    await user.tab();
    expect(screen.getByRole('region', { name: 'Sortable' })).toHaveFocus();
    for (const name of ['Name', 'Age', 'Team']) {
      await user.tab();
      expect(screen.getByRole('button', { name })).toHaveFocus();
    }
  });

  it('keeps the icon decorative', () => {
    render(<SortTable />);
    const icon = screen.getByRole('button', { name: 'Name' }).querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SortTable />);
    await expectNoA11yViolations(container);
  });

  it('keeps the focus and orders the DOM rows with the hook', async () => {
    const user = userEvent.setup();
    const data = [{ name: 'Bea' }, { name: 'Ada' }, { name: 'Cy' }];
    const columns = [{ id: 'name' }];
    function Hooked() {
      const { sortedData, getSortProps } = useTableSort({ data, columns });
      return (
        <Table aria-label="Hooked">
          <TableHead>
            <TableRow>
              <TableHeaderCell {...getSortProps('name')}>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((r) => (
              <TableRow key={r.name}>
                <TableCell>{r.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    render(<Hooked />);
    const rows = () => screen.getAllByRole('cell').map((c) => c.textContent);
    const button = screen.getByRole('button', { name: 'Name' });
    expect(rows()).toEqual(['Bea', 'Ada', 'Cy']);
    button.focus();
    await user.keyboard('{Enter}');
    expect(rows()).toEqual(['Ada', 'Bea', 'Cy']);
    expect(button).toHaveFocus();
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
    await user.keyboard(' ');
    expect(rows()).toEqual(['Cy', 'Bea', 'Ada']);
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
    await user.keyboard('{Enter}');
    expect(rows()).toEqual(['Bea', 'Ada', 'Cy']);
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');
  });
});
