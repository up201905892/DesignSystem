import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Badge } from '../Badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  type TableProps,
} from './Table';

function Sample(props: Partial<TableProps> = {}) {
  return (
    <Table aria-label="Users" {...props}>
      <TableCaption>Team members</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell align="end">Age</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableHeaderCell scope="row">Ada</TableHeaderCell>
          <TableCell numeric>36</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>Grace</TableCell>
          <TableCell align="center">45</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders the native table structure', () => {
    const { container } = render(<Sample />);
    const table = container.querySelector('table');
    expect(table?.querySelector(':scope > caption')).not.toBeNull();
    expect(table?.querySelector(':scope > thead > tr > th')).not.toBeNull();
    expect(table?.querySelector(':scope > tbody > tr > td')).not.toBeNull();
    expect(table).toHaveClass('ds-table');
  });

  it('wraps the table in a focusable, named region', () => {
    render(<Sample />);
    const region = screen.getByRole('region', { name: 'Users' });
    expect(region).toHaveClass('ds-table-container');
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region.querySelector('table')).not.toBeNull();
  });

  it('names the region with aria-labelledby', () => {
    render(
      <>
        <h2 id="t">Orders</h2>
        <Table aria-labelledby="t">
          <TableBody>
            <TableRow>
              <TableCell>x</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    );
    expect(screen.getByRole('region', { name: 'Orders' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Orders' })).toBeInTheDocument();
  });

  it('exposes the table by its accessible name and counts roles', () => {
    render(<Sample aria-label="Team members" />);
    expect(screen.getByRole('table', { name: 'Team members' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('rowheader')).toHaveLength(1);
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('uses scope col by default and accepts row', () => {
    render(<Sample />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toHaveAttribute('scope', 'row');
  });

  it('sets align and numeric data attributes', () => {
    render(<Sample />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'data-align',
      'start',
    );
    expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveAttribute('data-align', 'end');
    const numeric = screen.getByRole('cell', { name: '36' });
    expect(numeric).toHaveAttribute('data-numeric', 'true');
    expect(numeric).toHaveAttribute('data-align', 'end');
    expect(screen.getByRole('cell', { name: '45' })).toHaveAttribute('data-align', 'center');
    expect(screen.getByRole('cell', { name: 'Grace' })).not.toHaveAttribute('data-numeric');
  });

  it('sets size, striped and stickyHeader data attributes', () => {
    const { rerender } = render(<Sample />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('data-size', 'md');
    expect(table).not.toHaveAttribute('data-striped');
    expect(table).not.toHaveAttribute('data-sticky-header');
    rerender(<Sample size="sm" striped stickyHeader />);
    expect(table).toHaveAttribute('data-size', 'sm');
    expect(table).toHaveAttribute('data-striped', 'true');
    expect(table).toHaveAttribute('data-sticky-header', 'true');
  });

  it('marks selected rows', () => {
    render(<Sample />);
    const rows = screen.getAllByRole('row');
    expect(rows[2]).toHaveAttribute('aria-selected', 'true');
    expect(rows[2]).toHaveAttribute('data-selected', 'true');
    expect(rows[1]).not.toHaveAttribute('aria-selected');
    expect(rows[1]).not.toHaveAttribute('data-selected');
  });

  it('can hide the caption visually and keep it for assistive technology', () => {
    render(
      <Table aria-label="Users">
        <TableCaption visuallyHidden>Hidden title</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText('Hidden title')).toHaveAttribute('data-visually-hidden', 'true');
  });

  it('forwards refs and className on every part', () => {
    const refs = {
      table: createRef<HTMLTableElement>(),
      caption: createRef<HTMLTableCaptionElement>(),
      head: createRef<HTMLTableSectionElement>(),
      body: createRef<HTMLTableSectionElement>(),
      row: createRef<HTMLTableRowElement>(),
      th: createRef<HTMLTableCellElement>(),
      td: createRef<HTMLTableCellElement>(),
    };
    render(
      <Table aria-label="x" ref={refs.table} className="c-table">
        <TableCaption ref={refs.caption} className="c-caption">
          cap
        </TableCaption>
        <TableHead ref={refs.head} className="c-head">
          <TableRow ref={refs.row} className="c-row">
            <TableHeaderCell ref={refs.th} className="c-th">
              h
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody ref={refs.body} className="c-body">
          <TableRow>
            <TableCell ref={refs.td} className="c-td">
              d
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(refs.table.current).toBeInstanceOf(HTMLTableElement);
    expect(refs.table.current).toHaveClass('ds-table', 'c-table');
    expect(refs.caption.current).toHaveClass('ds-table__caption', 'c-caption');
    expect(refs.head.current).toHaveClass('ds-table__head', 'c-head');
    expect(refs.body.current).toHaveClass('ds-table__body', 'c-body');
    expect(refs.row.current).toHaveClass('ds-table__row', 'c-row');
    expect(refs.th.current).toHaveClass('ds-table__header-cell', 'c-th');
    expect(refs.td.current).toHaveClass('ds-table__cell', 'c-td');
  });

  it('sets display names', () => {
    expect(Table.displayName).toBe('Table');
    expect(TableCell.displayName).toBe('TableCell');
  });

  it('puts Tab focus on the scroll container', async () => {
    render(<Sample />);
    await userEvent.tab();
    expect(screen.getByRole('region', { name: 'Users' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Table aria-label="Users">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow selected>
            <TableCell>Ada</TableCell>
            <TableCell>
              <Badge variant="success">Active</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    await expectNoA11yViolations(container);
  });
});
