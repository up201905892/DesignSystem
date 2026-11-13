import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
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

/**
 * Use `focusableWhenDisabled` when the focused control can become disabled because it was
 * activated (for example "next" on the last page), so the focus is not lost. The button keeps
 * `aria-disabled="true"` and stays in the Tab order; clicks are blocked. Without it, `disabled`
 * takes the button out of the Tab order.
 */
export const FocusableWhenDisabled: Story = {
  render: () => (
    <div style={row}>
      <Button disabled focusableWhenDisabled>
        Focusable
      </Button>
      <Button disabled>Not focusable</Button>
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
    const button = within(canvasElement).getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    const before = button.getBoundingClientRect().width;
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute('data-loading'));
    await expect(button).toHaveFocus();
    const after = button.getBoundingClientRect().width;
    await expect(Math.abs(after - before)).toBeLessThanOrEqual(0.5);
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
      <Button disabled focusableWhenDisabled>
        Focusable
      </Button>
      <Button loading>Loading</Button>
      <Button asChild>
        <a href="#docs">Link</a>
      </Button>
    </div>
  ),
};
