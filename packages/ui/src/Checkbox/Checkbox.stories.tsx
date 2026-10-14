import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field, FieldDescription, FieldError } from '../Field';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { children: 'I accept the terms' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' } as const;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Indeterminate: Story = { args: { checked: 'indeterminate' } };

export const Disabled: Story = {
  render: (args) => (
    <div style={column}>
      <Checkbox {...args} disabled />
      <Checkbox {...args} disabled defaultChecked />
      <Checkbox {...args} disabled checked="indeterminate" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      <Checkbox {...args} size="sm" defaultChecked>
        Small
      </Checkbox>
      <Checkbox {...args} size="md" defaultChecked>
        Medium
      </Checkbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const el of canvasElement.querySelectorAll<HTMLElement>('.ds-checkbox')) {
      const { width, height } = el.getBoundingClientRect();
      if (width < 24 || height < 24) throw new Error(`Click area is ${width}x${height}px`);
    }
  },
};

export const WithField: Story = {
  render: () => (
    <div style={column}>
      <Field>
        <Checkbox>I accept the terms</Checkbox>
        <FieldDescription>You can change this later.</FieldDescription>
      </Field>
      <Field invalid required>
        <Checkbox>I accept the terms</Checkbox>
        <FieldError>You must accept the terms.</FieldError>
      </Field>
    </div>
  ),
};

const options = ['Email', 'SMS', 'Push'];

function GroupExample() {
  const [selected, setSelected] = useState<string[]>(['Email']);
  const all = selected.length === options.length;
  const none = selected.length === 0;
  return (
    <div role="group" aria-label="Notifications" style={column}>
      <Checkbox
        checked={all ? true : none ? false : 'indeterminate'}
        onCheckedChange={(value) => setSelected(value === true ? options : [])}
      >
        Select all
      </Checkbox>
      {options.map((option) => (
        <Checkbox
          key={option}
          checked={selected.includes(option)}
          onCheckedChange={(value) =>
            setSelected((current) =>
              value === true ? [...current, option] : current.filter((item) => item !== option),
            )
          }
        >
          {option}
        </Checkbox>
      ))}
    </div>
  );
}

export const Group: Story = { render: () => <GroupExample /> };

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={column}>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox checked="indeterminate">Indeterminate</Checkbox>
      <Checkbox disabled defaultChecked>
        Disabled
      </Checkbox>
      <Field invalid>
        <Checkbox>Invalid</Checkbox>
        <FieldError>Required.</FieldError>
      </Field>
    </div>
  ),
};
