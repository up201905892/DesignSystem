import { createRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import type { TableSortState } from '../Table';
import { DataTable, type DataTableColumn } from './DataTable';

interface Person {
  id: string;
  name: string;
  age: number;
}

// 25 people; ages are 20..44, but the largest age (99) is on the last row of page 3.
const people: Person[] = Array.from({ length: 25 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Person ${String(i + 1).padStart(2, '0')}`,
  age: i === 24 ? 99 : 20 + i,
}));

const columns: DataTableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'age', header: 'Age', accessor: 'age', sortable: true, numeric: true },
];

function renderTable(props: Partial<React.ComponentProps<typeof DataTable<Person>>> = {}) {
  return render(
    <DataTable
      caption="People"
      data={people}
      columns={columns}
      getRowId={(p) => p.id}
      {...props}
    />,
  );
}

const bodyRows = () => screen.getAllByRole('row').slice(1);
const firstCell = () => within(bodyRows()[0]!).getAllByRole('cell')[0]!;

describe('DataTable', () => {
  it('shows one page of rows and the page count', () => {
    renderTable();
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 4' })).toBeNull();
    expect(screen.getByText('1–10 of 25')).toBeInTheDocument();
  });

  it('shows the remaining rows on the last page', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(bodyRows()).toHaveLength(5);
    expect(screen.getByText('21–25 of 25')).toBeInTheDocument();
  });

  it('names the table with the caption', () => {
    renderTable();
    expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'People' })).toBeInTheDocument();
  });

  it('keeps the caption in the DOM when it is hidden', () => {
    renderTable({ captionHidden: true });
    expect(screen.getByText('People')).toHaveAttribute('data-visually-hidden', 'true');
  });

  it('sorts all the data before paginating', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(screen.getByRole('button', { name: 'Age' }));
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(within(bodyRows()[0]!).getByText('99')).toBeInTheDocument();
  });

  it('goes back to page 1 when the sort changes', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(screen.getByText('11–20 of 25')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(screen.getByText('1–10 of 25')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
  });

  it('applies defaultSort', () => {
    renderTable({ defaultSort: { columnId: 'age', direction: 'desc' } });
    expect(firstCell()).toHaveTextContent('Person 25');
  });

  it('turns the pagination off with pageSize 0', () => {
    renderTable({ pageSize: 0 });
    expect(bodyRows()).toHaveLength(25);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('shows the empty message over all the columns and no pagination', async () => {
    const { container } = renderTable({ data: [] });
    const rows = bodyRows();
    expect(rows).toHaveLength(1);
    const cell = within(rows[0]!).getByRole('cell', { name: 'No results' });
    expect(cell).toHaveAttribute('colspan', '2');
    expect(screen.queryByRole('navigation')).toBeNull();
    await expectNoA11yViolations(container);
  });

  it('accepts a custom empty message', () => {
    renderTable({ data: [], emptyMessage: 'Nothing here' });
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders custom cells with the typed row', () => {
    renderTable({
      columns: [
        { id: 'name', header: 'Name', accessor: 'name' },
        {
          id: 'actions',
          header: 'Actions',
          accessor: (p) => p.id,
          cell: (p) => <button type="button">Edit {p.name}</button>,
        },
      ],
    });
    expect(screen.getByRole('button', { name: 'Edit Person 01' })).toBeInTheDocument();
  });

  it('reads function accessors and aligns numeric columns', () => {
    renderTable({
      columns: [{ id: 'double', header: 'Double', accessor: (p) => p.age * 2, numeric: true }],
    });
    const cell = firstCell();
    expect(cell).toHaveTextContent('40');
    expect(cell).toHaveAttribute('data-align', 'end');
  });

  it('sorts with a custom compare', async () => {
    const user = userEvent.setup();
    renderTable({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name',
          sortable: true,
          compare: (a, b) => b.age - a.age,
        },
      ],
    });
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(firstCell()).toHaveTextContent('Person 25');
  });

  it('only makes sortable columns buttons', () => {
    renderTable({
      columns: [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'age', header: 'Age', accessor: 'age', sortable: true },
      ],
    });
    expect(screen.queryByRole('button', { name: 'Name' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Age' })).toBeInTheDocument();
  });

  it('supports a controlled sort', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    renderTable({ sort: { columnId: 'age', direction: 'desc' }, onSortChange });
    expect(firstCell()).toHaveTextContent('Person 25');
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(onSortChange).toHaveBeenCalledWith(null);
    // Still sorted: the state belongs to the consumer.
    expect(firstCell()).toHaveTextContent('Person 25');
  });

  it('supports a controlled page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderTable({ page: 2, onPageChange });
    expect(screen.getByText('11–20 of 25')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByText('11–20 of 25')).toBeInTheDocument();
  });

  it('asks the controlled page to go back to 1 when the sort changes', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderTable({ page: 2, onPageChange });
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('works with both sort and page controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [sort, setSort] = useState<TableSortState | null>(null);
      const [page, setPage] = useState(2);
      return (
        <DataTable
          caption="People"
          data={people}
          columns={columns}
          getRowId={(p) => p.id}
          sort={sort}
          onSortChange={setSort}
          page={page}
          onPageChange={setPage}
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByText('11–20 of 25')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(screen.getByText('1–10 of 25')).toBeInTheDocument();
  });

  it('uses getRangeLabel for the summary', () => {
    renderTable({ getRangeLabel: ({ start, end, total }) => `Rows ${start}-${end} (${total})` });
    expect(screen.getByText('Rows 1-10 (25)')).toBeInTheDocument();
  });

  it('forwards ref and className and passes native props', () => {
    const ref = createRef<HTMLDivElement>();
    renderTable({ ref, className: 'custom', 'data-testid': 'root' } as never);
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current).toHaveClass('ds-data-table', 'custom');
    expect(DataTable.displayName).toBe('DataTable');
  });

  it('passes size and striped to the table', () => {
    renderTable({ size: 'sm', striped: true });
    expect(screen.getByRole('table')).toHaveAttribute('data-size', 'sm');
    expect(screen.getByRole('table')).toHaveAttribute('data-striped', 'true');
  });

  it('does not change the data it receives', async () => {
    const user = userEvent.setup();
    const copy = [...people];
    renderTable();
    await user.click(screen.getByRole('button', { name: 'Age' }));
    await user.click(screen.getByRole('button', { name: 'Age' }));
    expect(people).toEqual(copy);
  });

  it('rejects an accessor that is not a key of the row', () => {
    const bad: DataTableColumn<Person> = {
      id: 'x',
      header: 'X',
      // @ts-expect-error "missing" is not a key of Person
      accessor: 'missing',
    };
    expect(bad.id).toBe('x');
  });
});

describe('DataTable accessibility', () => {
  it('has no axe violations with data', async () => {
    const { container } = renderTable();
    await expectNoA11yViolations(container);
  });

  it('announces the new range in a polite live region and keeps the focus', async () => {
    const user = userEvent.setup();
    renderTable();
    const live = screen.getByText('1–10 of 25');
    expect(live).toHaveAttribute('aria-live', 'polite');
    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(live).toHaveTextContent('11–20 of 25');
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(live).toHaveTextContent('21–25 of 25');
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveFocus();
  });

  it('tabs through sortable headers, interactive cells and then the pagination', async () => {
    const user = userEvent.setup();
    renderTable({
      pageSize: 2,
      columns: [
        ...columns,
        {
          id: 'edit',
          header: 'Edit',
          accessor: 'id',
          cell: (p) => <button type="button">Edit {p.id}</button>,
        },
      ],
    });
    await user.tab();
    expect(screen.getByRole('region', { name: 'People' })).toHaveFocus();
    const order = ['Name', 'Age', 'Edit p1', 'Edit p2', 'Previous page', 'Page 1'];
    for (const name of order) {
      await user.tab();
      expect(screen.getByRole('button', { name })).toHaveFocus();
    }
  });

  it('sorts and changes page with the keyboard only', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Name' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await user.keyboard('{Tab}{Tab}{Tab}{Tab}');
    await user.keyboard(' ');
    expect(screen.getByText('11–20 of 25')).toBeInTheDocument();
  });
});
