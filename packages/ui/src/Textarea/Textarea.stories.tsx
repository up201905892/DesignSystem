import type { Meta, StoryObj } from '@storybook/react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field';
import { Input } from '../Input';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { 'aria-label': 'Message', placeholder: 'Type here' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' } as const;
const row = { display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'flex-start' } as const;

const heights = { sm: 32, md: 40, lg: 48 } as const;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={row}>
          <Input aria-label={`Input ${size}`} size={size} placeholder={`Input ${size}`} />
          <Textarea aria-label={`Single ${size}`} size={size} rows={1} placeholder="rows=1" />
          <Textarea aria-label={`Default ${size}`} size={size} placeholder="default rows" />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const [size, min] of Object.entries(heights)) {
      const input = canvasElement.querySelector<HTMLElement>(`.ds-input[data-size="${size}"]`);
      const single = canvasElement.querySelector<HTMLElement>(
        `.ds-textarea[data-size="${size}"][rows="1"]`,
      );
      const multi = canvasElement.querySelector<HTMLElement>(
        `.ds-textarea[data-size="${size}"][rows="3"]`,
      );
      if (!input || !single || !multi) throw new Error(`Missing elements for size ${size}`);
      const inputHeight = input.getBoundingClientRect().height;
      const singleHeight = single.getBoundingClientRect().height;
      const multiHeight = multi.getBoundingClientRect().height;
      if (singleHeight < min) {
        throw new Error(`Textarea ${size} is ${singleHeight}px, expected >= ${min}px`);
      }
      if (Math.abs(singleHeight - inputHeight) > 0.5) {
        throw new Error(`Size ${size}: textarea ${singleHeight}px, input ${inputHeight}px`);
      }
      if (multiHeight <= min) {
        throw new Error(`Textarea ${size} default rows is ${multiHeight}px, expected > ${min}px`);
      }
    }
  },
};

export const WithField: Story = {
  render: () => (
    <Field required>
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Write your message" />
      <FieldDescription>Up to a few paragraphs.</FieldDescription>
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid required>
      <FieldLabel>Message</FieldLabel>
      <Textarea defaultValue="Hi" />
      <FieldError>Write at least 10 characters.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <FieldLabel>Message</FieldLabel>
      <Textarea defaultValue="Not editable" />
    </Field>
  ),
};

export const ResizeNone: Story = {
  args: { resize: 'none', defaultValue: 'This field cannot be resized.' },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={column}>
      <Textarea aria-label="Default" placeholder="Default" />
      <Textarea aria-label="Read only" readOnly defaultValue="Read only" />
      <Textarea aria-label="Disabled" disabled defaultValue="Disabled" />
      <Field invalid>
        <FieldLabel>Invalid</FieldLabel>
        <Textarea defaultValue="Wrong" />
        <FieldError>Something is wrong.</FieldError>
      </Field>
    </div>
  ),
};
