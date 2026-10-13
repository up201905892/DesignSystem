import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { 'aria-label': 'Name', placeholder: 'Type here' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Example icon defined here so the story does not depend on the icons package. */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l4 4" />
  </svg>
);

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' } as const;
const row = { display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' } as const;

const heights = { sm: 32, md: 40, lg: 48 } as const;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={column}>
      <Input aria-label="Small" size="sm" placeholder="Small" />
      <Input aria-label="Medium" size="md" placeholder="Medium" />
      <Input aria-label="Large" size="lg" placeholder="Large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const [size, min] of Object.entries(heights)) {
      const el = canvasElement.querySelector<HTMLElement>(`.ds-input[data-size="${size}"]`);
      if (!el) throw new Error(`No input with size ${size}`);
      const actual = el.getBoundingClientRect().height;
      if (actual < min) throw new Error(`Input ${size} is ${actual}px, expected >= ${min}px`);
    }
  },
};

export const WithButton: Story = {
  render: () => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          <Input aria-label={`Search ${size}`} size={size} placeholder="Search" />
          <Button size={size}>Search</Button>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const size of Object.keys(heights)) {
      const input = canvasElement.querySelector<HTMLElement>(`.ds-input[data-size="${size}"]`);
      const button = canvasElement.querySelector<HTMLElement>(`.ds-button[data-size="${size}"]`);
      if (!input || !button) throw new Error(`Missing input or button for size ${size}`);
      const a = input.getBoundingClientRect().height;
      const b = button.getBoundingClientRect().height;
      if (Math.abs(a - b) > 0.5) throw new Error(`Size ${size}: input ${a}px, button ${b}px`);
    }
  },
};

export const WithField: Story = {
  render: () => (
    <Field required>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>We never share your email.</FieldDescription>
    </Field>
  ),
};

export const WithAddons: Story = {
  render: () => (
    <div style={column}>
      <Input aria-label="Search" leadingAddon={<SearchIcon />} placeholder="Search" />
      <Input aria-label="Amount" trailingAddon="EUR" placeholder="0.00" />
      <Input aria-label="Both" leadingAddon={<SearchIcon />} trailingAddon="EUR" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid required>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" defaultValue="not-an-email" />
      <FieldError>Enter a valid email.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <FieldLabel>Name</FieldLabel>
      <Input defaultValue="Ada Lovelace" leadingAddon={<SearchIcon />} />
    </Field>
  ),
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'Read only value' },
};

export const Password: Story = {
  render: () => (
    <Field required>
      <FieldLabel>Password</FieldLabel>
      <Input type="password" defaultValue="secret" />
    </Field>
  ),
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={column}>
      <Input aria-label="Default" placeholder="Default" leadingAddon={<SearchIcon />} />
      <Input aria-label="Read only" readOnly defaultValue="Read only" />
      <Input aria-label="Disabled" disabled defaultValue="Disabled" />
      <Field invalid>
        <FieldLabel>Invalid</FieldLabel>
        <Input defaultValue="Wrong" />
        <FieldError>Something is wrong.</FieldError>
      </Field>
    </div>
  ),
};
