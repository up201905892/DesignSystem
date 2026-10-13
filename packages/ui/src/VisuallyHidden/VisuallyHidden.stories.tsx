import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Utilities/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

const render: Story['render'] = (args) => (
  <button type="button">
    <span aria-hidden="true">×</span>
    <VisuallyHidden {...args} />
  </button>
);

export const Default: Story = {
  args: { children: 'Close' },
  render,
};

export const DarkTheme: Story = {
  args: { children: 'Close' },
  parameters: { theme: 'dark' },
  render,
};
