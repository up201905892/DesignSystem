/* The icon is rendered inside the anchor by IconButton (asChild). */
/* eslint-disable jsx-a11y/anchor-has-content */
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { IconButton } from './IconButton';

/** Example icon defined here so the story does not depend on the icons package. */
const Icon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { 'aria-label': 'Close', icon: <Icon /> },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = {
  display: 'flex',
  gap: 'var(--ds-space-3)',
  alignItems: 'center',
  flexWrap: 'wrap',
} as const;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={row}>
      <IconButton aria-label="Primary" icon={<Icon />} variant="primary" />
      <IconButton aria-label="Secondary" icon={<Icon />} variant="secondary" />
      <IconButton aria-label="Ghost" icon={<Icon />} variant="ghost" />
      <IconButton aria-label="Danger" icon={<Icon />} variant="danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <IconButton aria-label="Small" icon={<Icon />} size="sm" />
      <IconButton aria-label="Medium" icon={<Icon />} size="md" />
      <IconButton aria-label="Large" icon={<Icon />} size="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const min = { sm: 32, md: 40, lg: 48 } as const;
    for (const [size, side] of Object.entries(min)) {
      const el = canvasElement.querySelector<HTMLElement>(`[data-size="${size}"]`);
      if (!el) throw new Error(`No button with size ${size}`);
      const { width, height } = el.getBoundingClientRect();
      if (Math.abs(width - height) > 0.5)
        throw new Error(`Button ${size} is ${width}x${height}px, expected a square`);
      if (width < side) throw new Error(`Button ${size} is ${width}px, expected >= ${side}px`);
    }
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <IconButton aria-label="Primary" icon={<Icon />} disabled />
      <IconButton aria-label="Secondary" icon={<Icon />} variant="secondary" disabled />
      <IconButton aria-label="Ghost" icon={<Icon />} variant="ghost" disabled />
      <IconButton aria-label="Danger" icon={<Icon />} variant="danger" disabled />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={row}>
      <IconButton aria-label="Saving" icon={<Icon />} loading />
      <IconButton aria-label="Saving" icon={<Icon />} variant="secondary" loading />
      <IconButton aria-label="Saving" icon={<Icon />} variant="ghost" loading />
      <IconButton aria-label="Saving" icon={<Icon />} variant="danger" loading />
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <IconButton asChild aria-label="Settings" icon={<Icon />}>
      <a href="#settings" />
    </IconButton>
  ),
};

export const AsLinkDisabled: Story = {
  render: () => (
    <IconButton asChild disabled aria-label="Settings" icon={<Icon />}>
      <a href="#settings" />
    </IconButton>
  ),
};

export const NextToButton: Story = {
  render: () => (
    <div style={row}>
      <IconButton aria-label="Close" icon={<Icon />} size="md" />
      <Button size="md">Button</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector<HTMLElement>('[data-icon-only]');
    const button = canvasElement.querySelector<HTMLElement>('.ds-button:not([data-icon-only])');
    if (!icon || !button) throw new Error('Missing buttons');
    const a = icon.getBoundingClientRect().height;
    const b = button.getBoundingClientRect().height;
    if (Math.abs(a - b) > 0.5) throw new Error(`Heights differ: ${a}px vs ${b}px`);
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={row}>
      <IconButton aria-label="Primary" icon={<Icon />} variant="primary" />
      <IconButton aria-label="Secondary" icon={<Icon />} variant="secondary" />
      <IconButton aria-label="Ghost" icon={<Icon />} variant="ghost" />
      <IconButton aria-label="Danger" icon={<Icon />} variant="danger" />
      <IconButton aria-label="Disabled" icon={<Icon />} disabled />
    </div>
  ),
};
