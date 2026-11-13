import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { PencilIcon } from '@up201905892/icons';
import { Badge } from '../Badge';
import { IconButton } from '../IconButton';
import type { TableSortState } from '../Table';
import { DataTable, type DataTableColumn } from './DataTable';

interface Person {
  id: string;
  name: string;
  team: string;
  age: number;
  status: 'Active' | 'Away';
}

const teams = ['Design', 'Platform', 'Growth', 'Support'];

const people: Person[] = Array.from({ length: 50 }, (_, i) => ({
  id: `person-${i + 1}`,
  name: `Person ${String(i + 1).padStart(2, '0')}`,
  team: teams[i % teams.length]!,
  age: 22 + ((i * 7) % 35),
  status: i % 3 === 0 ? 'Away' : 'Active',
}));

const columns: DataTableColumn<Person>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'team', header: 'Team', accessor: 'team', sortable: true },
  { id: 'age', header: 'Age', accessor: 'age', sortable: true, numeric: true },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable<Person>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { caption: 'People', data: people, columns, getRowId: (p: Person) => p.id },
} satisfies Meta<typeof DataTable<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DataTable caption="People" data={people} columns={columns} getRowId={(p) => p.id} />
  ),
};

export const WithCustomCells: Story = {
  render: () => (
    <DataTable
      caption="People with status"
      data={people}
      getRowId={(p) => p.id}
      pageSize={5}
      columns={[
        ...columns,
        {
          id: 'status',
          header: 'Status',
          accessor: 'status',
          sortable: true,
          cell: (p) => (
            <Badge variant={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</Badge>
          ),
        },
        {
          id: 'edit',
          header: 'Edit',
          accessor: 'id',
          cell: (p) => (
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={`Edit ${p.name}`}
              icon={<PencilIcon />}
            />
          ),
        },
      ]}
    />
  ),
};

export const Empty: Story = {
  render: () => <DataTable caption="People" data={[]} columns={columns} getRowId={(p) => p.id} />,
};

export const NoPagination: Story = {
  render: () => (
    <DataTable
      caption="First ten people"
      data={people.slice(0, 10)}
      columns={columns}
      getRowId={(p) => p.id}
      pageSize={0}
    />
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [sort, setSort] = useState<TableSortState | null>({
      columnId: 'age',
      direction: 'desc',
    });
    const [page, setPage] = useState(2);
    return (
      <>
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
        <p>
          Page {page}, sort: {sort ? `${sort.columnId} ${sort.direction}` : 'none'}
        </p>
      </>
    );
  },
};

export const KeyboardInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sort a column and go to the next page using only the keyboard. The `play` function focuses the "Age" header, activates it and then the "Next page" button.',
      },
    },
  },
  render: () => (
    <DataTable caption="People" data={people} columns={columns} getRowId={(p) => p.id} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const age = Array.from(canvasElement.querySelectorAll<HTMLButtonElement>('th button')).find(
      (b) => b.textContent?.includes('Age'),
    );
    if (!age) throw new Error('No Age sort button');
    const next = canvas.getByRole('button', { name: 'Next page' });
    const tabTo = async (target: HTMLElement) => {
      for (let i = 0; i < 30 && document.activeElement !== target; i += 1) {
        await userEvent.tab();
      }
      await expect(target).toHaveFocus();
    };
    await tabTo(age);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(age.closest('th')).toHaveAttribute('aria-sort', 'ascending'));
    await tabTo(next);
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(canvasElement.querySelector('[aria-live="polite"]')).toHaveTextContent('11–20 of 50'),
    );
    await expect(next).toHaveFocus();
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <DataTable
      caption="People"
      data={people}
      columns={columns}
      getRowId={(p) => p.id}
      pageSize={5}
      striped
      defaultSort={{ columnId: 'name', direction: 'asc' }}
    />
  ),
};
