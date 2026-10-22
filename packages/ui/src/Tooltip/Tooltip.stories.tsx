import type { Meta, StoryObj } from '@storybook/react';
import { SettingsIcon } from '@ds/icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 2rem' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    content: 'Save your changes',
    children: <Button variant="secondary">Save</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Default: Story = { args: { defaultOpen: true } };

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '6rem', padding: '2rem' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip on the ${side}`} side={side} defaultOpen>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const OnIconButton: Story = {
  args: {
    content: 'Settings',
    defaultOpen: true,
    children: <IconButton aria-label="Open settings" icon={<SettingsIcon />} variant="ghost" />,
  },
};

export const LongContent: Story = {
  args: {
    defaultOpen: true,
    content:
      'This is a longer explanation that wraps onto several lines because the tooltip has a maximum width, including a verylongwordwithoutanyspacesthatmustbreak.',
  },
};

export const KeyboardInteraction: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">Focus me with Tab</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLButtonElement;
    trigger.focus();
    await wait(100);
    const open = document.querySelector('[role="tooltip"]');
    if (!open) throw new Error('Tooltip did not open on focus');
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await wait(100);
    if (document.querySelector('[role="tooltip"]'))
      throw new Error('Esc did not close the tooltip');
    if (document.activeElement !== trigger) throw new Error('Focus moved away from the trigger');
  },
};

export const DarkTheme: Story = {
  args: { defaultOpen: true },
  parameters: { theme: 'dark' },
};
