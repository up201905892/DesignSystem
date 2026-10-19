import type { Meta, StoryObj } from '@storybook/react';
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

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  args: { striped: true },
  render: (args) => (
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
  ),
};
