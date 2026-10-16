import type { Meta, StoryObj } from '@storybook/react';
import { Field, FieldDescription } from '../Field';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { children: 'Notifications' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' } as const;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = {
  render: (args) => (
    <div style={column}>
      <Switch {...args} disabled />
      <Switch {...args} disabled defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      <Switch {...args} size="sm" defaultChecked>
        Small
      </Switch>
      <Switch {...args} size="md" defaultChecked>
        Medium
      </Switch>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const el of canvasElement.querySelectorAll<HTMLElement>('.ds-switch')) {
      const { width, height } = el.getBoundingClientRect();
      if (width < 24 || height < 24) throw new Error(`Click area is ${width}x${height}px`);
    }
  },
};

export const WithField: Story = {
  render: () => (
    <Field>
      <Switch>Notifications</Switch>
      <FieldDescription>Applies immediately.</FieldDescription>
    </Field>
  ),
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={column}>
      <Switch>Off</Switch>
      <Switch defaultChecked>On</Switch>
      <Switch disabled>Disabled off</Switch>
      <Switch disabled defaultChecked>
        Disabled on
      </Switch>
    </div>
  ),
};
