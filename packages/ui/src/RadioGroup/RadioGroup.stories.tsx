import type { Meta, StoryObj } from '@storybook/react';
import { Field, FieldDescription, FieldError } from '../Field';
import { Radio, RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { 'aria-label': 'Plan' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' } as const;

export const Default: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal', defaultValue: 'free' } };

export const WithDefaultValue: Story = { args: { defaultValue: 'pro' } };

export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="free">
      <Radio value="free">Free</Radio>
      <Radio value="pro" disabled>
        Pro (unavailable)
      </Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  ),
};

export const DisabledGroup: Story = { args: { disabled: true, defaultValue: 'pro' } };

export const WithField: Story = {
  render: () => (
    <div style={column}>
      <Field>
        <span id="plan-label">Plan</span>
        <RadioGroup aria-labelledby="plan-label" defaultValue="free">
          <Radio value="free">Free</Radio>
          <Radio value="pro">Pro</Radio>
        </RadioGroup>
        <FieldDescription>You can change it later.</FieldDescription>
      </Field>
      <Field invalid required>
        <span id="plan-label-error">Billing</span>
        <RadioGroup aria-labelledby="plan-label-error">
          <Radio value="month">Monthly</Radio>
          <Radio value="year">Yearly</Radio>
        </RadioGroup>
        <FieldError>Choose a billing period.</FieldError>
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="sm">
      <Radio value="sm" size="sm">
        Small
      </Radio>
      <Radio value="md" size="md">
        Medium
      </Radio>
    </RadioGroup>
  ),
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={column}>
      <RadioGroup aria-label="Plan" defaultValue="pro">
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="team" disabled>
          Team
        </Radio>
      </RadioGroup>
      <Field invalid>
        <RadioGroup aria-label="Billing" orientation="horizontal">
          <Radio value="month">Monthly</Radio>
          <Radio value="year">Yearly</Radio>
        </RadioGroup>
        <FieldError>Required.</FieldError>
      </Field>
    </div>
  ),
};
