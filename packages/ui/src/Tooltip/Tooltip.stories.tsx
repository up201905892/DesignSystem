import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { SettingsIcon } from '@up201905892/icons';
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
    const trigger = within(canvasElement).getByRole('button');
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await within(document.body).findByRole('tooltip')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('tooltip')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Offset: Story = {
  args: { side: 'bottom', sideOffset: '4', defaultOpen: true },
  play: async ({ canvasElement }) => {
    await wait(300);
    const trigger = canvasElement.querySelector<HTMLElement>('button');
    const content = document.querySelector<HTMLElement>('[role="tooltip"]')?.parentElement;
    if (!trigger || !content) throw new Error('Tooltip did not open');
    const probe = document.createElement('div');
    probe.style.height = 'var(--ds-space-4)';
    document.body.append(probe);
    const expected = probe.getBoundingClientRect().height;
    probe.remove();
    const gap = content.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom;
    if (Math.abs(gap - expected) > 1) throw new Error(`Gap is ${gap}px, expected ${expected}px`);
  },
};

export const DarkTheme: Story = {
  args: { defaultOpen: true },
  parameters: { theme: 'dark' },
};
