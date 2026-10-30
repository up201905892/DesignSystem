import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = {
  display: 'flex',
  gap: 'var(--ds-space-4)',
  alignItems: 'center',
  color: 'var(--ds-color-text-default)',
} as const;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const CustomLabel: Story = {
  args: { label: 'Saving' },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={row}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" label="Saving" />
    </div>
  ),
};
