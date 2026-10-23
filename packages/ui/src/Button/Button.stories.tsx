import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Example icon defined here so the story does not depend on the icons package. */
const Icon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const row = {
  display: 'flex',
  gap: 'var(--ds-space-3)',
  alignItems: 'center',
  flexWrap: 'wrap',
} as const;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger' } };

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const min = { sm: 32, md: 40, lg: 48 } as const;
    for (const [size, height] of Object.entries(min)) {
      const el = canvasElement.querySelector<HTMLElement>(`[data-size="${size}"]`);
      if (!el) throw new Error(`No button with size ${size}`);
      const actual = el.getBoundingClientRect().height;
      if (actual < height)
        throw new Error(`Button ${size} is ${actual}px, expected >= ${height}px`);
    }
  },
};

export const WithIcons: Story = {
  render: () => (
    <div style={row}>
      <Button leadingIcon={<Icon />}>Leading</Button>
      <Button trailingIcon={<Icon />}>Trailing</Button>
      <Button leadingIcon={<Icon />} trailingIcon={<Icon />} variant="secondary">
        Both
      </Button>
    </div>
  ),
};

export const FullWidth: Story = { args: { fullWidth: true } };

export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <Button disabled>Primary</Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
      <Button disabled variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A loading button shows a `Spinner` in place of the leading icon, sets `aria-busy` and ' +
          '`aria-disabled`, and blocks clicks. Unlike `disabled`, it stays focusable and in the ' +
          'Tab order, so keyboard and screen reader users keep their place while the action runs. ' +
          'The button does not announce the result: use a `Toast` or another visible, announced ' +
          'feedback for success or error.',
      },
    },
  },
  render: () => (
    <div style={row}>
      <Button loading variant="primary">
        Primary
      </Button>
      <Button loading variant="secondary">
        Secondary
      </Button>
      <Button loading variant="ghost">
        Ghost
      </Button>
      <Button loading variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const LoadingToggle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Click the button to start loading. Focus stays on the button and its width does not ' +
          'change, because the `Spinner` replaces the leading icon.',
      },
    },
  },
  render: function Render() {
    const [loading, setLoading] = useState(false);
    return (
      <Button leadingIcon={<Icon />} loading={loading} onClick={() => setLoading(true)}>
        Save
      </Button>
    );
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>('button');
    if (!button) throw new Error('No button');
    button.focus();
    const before = button.getBoundingClientRect().width;
    button.click();
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    if (!button.hasAttribute('data-loading')) throw new Error('Button is not loading');
    if (document.activeElement !== button) throw new Error('Focus left the button');
    const after = button.getBoundingClientRect().width;
    if (Math.abs(after - before) > 0.5) throw new Error(`Width changed: ${before} -> ${after}`);
  },
};

export const AsLink: Story = {
  render: () => (
    <Button asChild leadingIcon={<Icon />} trailingIcon={<Icon />}>
      <a href="#docs">Documentation</a>
    </Button>
  ),
};

export const AsLinkDisabled: Story = {
  render: () => (
    <Button asChild disabled>
      <a href="#docs">Documentation</a>
    </Button>
  ),
};

export const AsLinkLoading: Story = {
  render: () => (
    <Button asChild loading>
      <a href="#docs">Documentation</a>
    </Button>
  ),
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={row}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button asChild>
        <a href="#docs">Link</a>
      </Button>
    </div>
  ),
};
