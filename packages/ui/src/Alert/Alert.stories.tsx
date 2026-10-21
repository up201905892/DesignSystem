import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { title: 'Heads up', children: 'You can change this later in the settings.' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants = ['info', 'success', 'warning', 'danger'] as const;

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' } as const;

export const Info: Story = { args: { variant: 'info' } };

export const Success: Story = {
  args: { variant: 'success', title: 'Saved', children: 'Your changes were saved.' },
};

export const Warning: Story = {
  args: { variant: 'warning', title: 'Almost full', children: 'You have used 90% of your space.' },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Payment failed',
    children: 'Check your card details and try again.',
  },
};

export const WithoutTitle: Story = { args: { title: undefined } };

export const Dismissible: Story = { args: { onClose: () => {} } };

export const LongContent: Story = {
  args: {
    onClose: () => {},
    title: 'A very long title that goes on and on until it has to wrap onto another line',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Averyveryveryveryverylongwordwithoutanyspacesthatmustnotbreakthelayoutofthealert.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '24rem', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: (args) => (
    <div style={column}>
      {variants.map((v) => (
        <Alert key={v} {...args} variant={v} onClose={() => {}} />
      ))}
    </div>
  ),
};
