import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ds-space-3)',
  maxWidth: '24rem',
} as const;

export const Text: Story = {
  args: { variant: 'text', lines: 3 },
  render: (args) => (
    <div style={column}>
      <Skeleton {...args} />
    </div>
  ),
};

export const Rect: Story = {
  args: { variant: 'rect', height: 120 },
  render: (args) => (
    <div style={column}>
      <Skeleton {...args} />
    </div>
  ),
};

export const Circle: Story = {
  args: { variant: 'circle', width: 48, height: 48 },
};

function Placeholder() {
  return (
    <div style={{ ...column, flexDirection: 'row', alignItems: 'flex-start' }} aria-busy="true">
      <Skeleton variant="circle" width={48} height={48} />
      <div style={{ ...column, flex: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" lines={3} />
        <Skeleton variant="rect" height={80} />
      </div>
    </div>
  );
}

export const CardPlaceholder: Story = {
  render: () => <Placeholder />,
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => <Placeholder />,
};
