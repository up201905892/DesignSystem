import type { Meta, StoryObj } from '@storybook/react';
import { Field, FieldDescription, FieldError, FieldLabel, useFieldControl } from './Field';

/** Native input wired through the hook until the Input component exists. */
const NativeInput = () => <input {...useFieldControl()} />;

const meta = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  render: (args) => (
    <Field {...args}>
      <FieldLabel>Name</FieldLabel>
      <NativeInput />
      <FieldError>Name is required.</FieldError>
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

const withDescription: Story['render'] = (args) => (
  <Field {...args}>
    <FieldLabel>Name</FieldLabel>
    <NativeInput />
    <FieldDescription>As it appears on your ID.</FieldDescription>
    <FieldError>Name is required.</FieldError>
  </Field>
);

export const Default: Story = {};

export const WithDescription: Story = { render: withDescription };

export const Required: Story = { args: { required: true }, render: withDescription };

export const Invalid: Story = { args: { invalid: true, required: true }, render: withDescription };

export const Disabled: Story = { args: { disabled: true }, render: withDescription };

export const DarkTheme: Story = {
  args: { invalid: true, required: true },
  parameters: { theme: 'dark' },
  render: withDescription,
};
