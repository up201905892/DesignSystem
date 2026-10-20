import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Badge } from '../Badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from './Table';
import {
  useTableSort,
  type TableSortColumn,
  type TableSortState,
  type UseTableSortOptions,
} from './useTableSort';

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { 'aria-label': 'Team members' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const people = [
  { name: 'Ada Lovelace', role: 'Engineer', status: 'Active', amount: 1250.5 },
  { name: 'Grace Hopper', role: 'Admiral', status: 'Active', amount: 980 },
  { name: 'Alan Turing', role: 'Researcher', status: 'Pending', amount: 1432.25 },
  { name: 'Margaret Hamilton', role: 'Lead', status: 'Inactive', amount: 75 },
];

const statusVariant = { Active: 'success', Pending: 'warning', Inactive: 'neutral' } as const;

function Rows() {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Role</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {people.map((p) => (
          <TableRow key={p.name}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.role}</TableCell>
            <TableCell>{p.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <Rows />
    </Table>
  ),
};

export const Striped: Story = {
  args: { striped: true },
  render: (args) => (
    <Table {...args}>
      <Rows />
    </Table>
  ),
};

export const Dense: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <Table {...args}>
      <Rows />
    </Table>
  ),
};

export const WithCaption: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Team members and their roles</TableCaption>
      <Rows />
    </Table>
  ),
};

export const NumericColumns: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell align="end">Balance</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {people.map((p) => (
          <TableRow key={p.name}>
            <TableHeaderCell scope="row">{p.name}</TableHeaderCell>
            <TableCell numeric>{p.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

const manyRows = Array.from({ length: 20 }, (_, i) => `Member ${i + 1}`);

export const StickyHeader: Story = {
  args: { stickyHeader: true },
  render: (args) => (
    <div style={{ ['--ds-table-max-height' as string]: '16rem' }}>
      <Table {...args}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {manyRows.map((name) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>Engineer</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const HorizontalScroll: Story = {
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <Table {...args}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Location</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {people.map((p) => (
            <TableRow key={p.name}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.role}</TableCell>
              <TableCell>{p.name.split(' ')[0]?.toLowerCase()}@example.com</TableCell>
              <TableCell>Lisbon, Portugal</TableCell>
              <TableCell>Research and development</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const WithBadges: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {people.map((p) => (
          <TableRow key={p.name} selected={p.status === 'Pending'}>
            <TableCell>{p.name}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[p.status as keyof typeof statusVariant]}>
                {p.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

interface Person {
  name: string;
  role: string;
  amount: number;
  joined: Date | null;
}

const sortData: Person[] = [
  { name: 'Ada Lovelace', role: 'Engineer', amount: 1250.5, joined: new Date('2021-03-14') },
  { name: 'grace Hopper', role: 'Admiral', amount: 980, joined: new Date('2019-07-01') },
  { name: 'Álvaro Silva', role: 'Engineer', amount: 75, joined: null },
  { name: 'Alan Turing', role: 'Researcher', amount: 1432.25, joined: new Date('2020-11-30') },
  { name: 'Margaret Hamilton', role: 'Lead', amount: 98, joined: new Date('2018-02-09') },
];

const sortColumns: TableSortColumn<Person>[] = [
  { id: 'name' },
  { id: 'role' },
  { id: 'amount' },
  { id: 'joined' },
];

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

function SortableRows({
  rows,
  getSortProps,
}: {
  rows: Person[];
  getSortProps: ReturnType<typeof useTableSort<Person>>['getSortProps'];
}) {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableHeaderCell {...getSortProps('name')}>Name</TableHeaderCell>
          <TableHeaderCell {...getSortProps('role')}>Role</TableHeaderCell>
          <TableHeaderCell align="end" {...getSortProps('amount')}>
            Balance
          </TableHeaderCell>
          <TableHeaderCell {...getSortProps('joined')}>Joined</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((p) => (
          <TableRow key={p.name}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.role}</TableCell>
            <TableCell numeric>{p.amount.toFixed(2)}</TableCell>
            <TableCell>{p.joined ? dateFormat.format(p.joined) : 'Unknown'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

function SortableTable(props: Partial<UseTableSortOptions<Person>> & { columns?: never }) {
  const { sortedData, getSortProps } = useTableSort<Person>({
    data: sortData,
    columns: sortColumns,
    ...props,
  });
  return (
    <Table aria-label="Sortable team members">
      <SortableRows rows={sortedData} getSortProps={getSortProps} />
    </Table>
  );
}

/** Uncontrolled: the hook keeps the state. Click a header: ascending, descending, none. */
export const Sortable: Story = {
  render: () => <SortableTable />,
};

function ControlledSort() {
  const [sort, setSort] = useState<TableSortState | null>({
    columnId: 'amount',
    direction: 'desc',
  });
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
      <SortableTable sort={sort} onSortChange={setSort} />
      <p style={{ margin: 0 }}>
        Sort state: <code>{JSON.stringify(sort)}</code>
      </p>
    </div>
  );
}

/** Controlled: the parent owns the sort state with `sort` and `onSortChange`. */
export const SortableControlled: Story = {
  render: () => <ControlledSort />,
};

/** The table starts sorted by `defaultSort`. */
export const DefaultSort: Story = {
  render: () => <SortableTable defaultSort={{ columnId: 'joined', direction: 'asc' }} />,
};

const roleOrder = ['Lead', 'Admiral', 'Researcher', 'Engineer'];
const customColumns: TableSortColumn<Person>[] = [
  { id: 'name' },
  {
    id: 'role',
    compare: (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role),
  },
  { id: 'amount' },
  { id: 'joined' },
];

function CustomCompareTable() {
  const { sortedData, getSortProps } = useTableSort<Person>({
    data: sortData,
    columns: customColumns,
    defaultSort: { columnId: 'role', direction: 'asc' },
  });
  return (
    <Table aria-label="Team members with custom role order">
      <SortableRows rows={sortedData} getSortProps={getSortProps} />
    </Table>
  );
}

/** The Role column has its own `compare`: seniority order instead of alphabetical. */
export const CustomCompare: Story = {
  render: () => <CustomCompareTable />,
};

/** Activate a header with the keyboard: the focus stays on the button and `aria-sort` changes. */
export const SortKeyboardInteraction: Story = {
  render: () => <SortableTable />,
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('th');
    const button = header?.querySelector<HTMLButtonElement>('button');
    if (!header || !button) throw new Error('No sortable header');
    button.focus();
    if (document.activeElement !== button) throw new Error('Sort button did not get the focus');
    const firstCell = () => canvasElement.querySelector('tbody td')?.textContent;
    if (header.getAttribute('aria-sort') !== 'none') throw new Error('Expected aria-sort none');
    // React commits the update after the event, so wait for the next frame.
    const settle = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    button.click();
    await settle();
    if (header.getAttribute('aria-sort') !== 'ascending')
      throw new Error('Expected aria-sort ascending');
    if (firstCell() !== 'Ada Lovelace') throw new Error(`Unexpected first row ${firstCell()}`);
    if (document.activeElement !== button) throw new Error('Focus left the sort button');
    button.click();
    await settle();
    if (header.getAttribute('aria-sort') !== 'descending')
      throw new Error('Expected aria-sort descending');
    if (document.activeElement !== button) throw new Error('Focus left the sort button');
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  args: { striped: true },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <SortableTable />
      <DarkStatic {...args} />
    </div>
  ),
};

function DarkStatic(args: React.ComponentProps<typeof Table>) {
  return (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align="end">Balance</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {people.map((p) => (
          <TableRow key={p.name} selected={p.status === 'Pending'}>
            <TableCell>{p.name}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[p.status as keyof typeof statusVariant]}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell numeric>{p.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
