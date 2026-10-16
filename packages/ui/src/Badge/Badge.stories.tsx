import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Active' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const;

const row = {
  display: 'flex',
  gap: 'var(--ds-space-3)',
  alignItems: 'center',
  flexWrap: 'wrap',
} as const;

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' } as const;

const label = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={row}>
      {variants.map((v) => (
        <Badge key={v} variant={v}>
          {label(v)}
        </Badge>
      ))}
    </div>
  ),
};

export const Solid: Story = {
  render: () => (
    <div style={row}>
      {variants.map((v) => (
        <Badge key={v} variant={v} appearance="solid">
          {label(v)}
        </Badge>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="sm" variant="danger" appearance="solid">
        3
      </Badge>
      <Badge size="md" variant="danger" appearance="solid">
        3
      </Badge>
    </div>
  ),
};

export const LongText: Story = {
  render: () => (
    <div style={{ width: '12rem' }}>
      <Badge variant="info">A very long status label that does not fit in its container</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector<HTMLElement>('.ds-badge');
    const parent = badge?.parentElement;
    if (!badge || !parent) throw new Error('Badge not found');
    if (badge.getBoundingClientRect().width > parent.getBoundingClientRect().width + 1)
      throw new Error('Badge is wider than its container');
    if (badge.scrollWidth <= badge.clientWidth) throw new Error('Text was expected to be cut');
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={column}>
      <div style={row}>
        {variants.map((v) => (
          <Badge key={v} variant={v}>
            {label(v)}
          </Badge>
        ))}
      </div>
      <div style={row}>
        {variants.map((v) => (
          <Badge key={v} variant={v} appearance="solid">
            {label(v)}
          </Badge>
        ))}
      </div>
    </div>
  ),
};
