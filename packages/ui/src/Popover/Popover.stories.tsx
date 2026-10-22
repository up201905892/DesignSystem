import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Field, FieldLabel } from '../Field';
import { Input } from '../Input';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Details">
        <p style={{ margin: 0 }}>Content of the popover.</p>
      </PopoverContent>
    </Popover>
  ),
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--ds-space-16) var(--ds-space-8)', minHeight: '20rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const press = (target: Element, key: string) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

export const Default: Story = { args: { defaultOpen: true } };

export const Placement: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, max-content)',
        gap: 'var(--ds-space-8)',
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).flatMap((side) =>
        (['start', 'center', 'end'] as const).map((align) => (
          <Popover key={`${side}-${align}`}>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm">
                {side} / {align}
              </Button>
            </PopoverTrigger>
            <PopoverContent aria-label={`${side} ${align}`} side={side} align={align}>
              {side} / {align}
            </PopoverContent>
          </Popover>
        )),
      )}
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button>Rename</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Rename item" align="start">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' }}>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input defaultValue="Quarterly report" />
          </Field>
          <PopoverClose asChild>
            <Button size="sm">Save</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithCloseButton: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Info</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Information" showClose closeLabel="Close information">
        A popover with a close button in the corner.
      </PopoverContent>
    </Popover>
  ),
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'flex-start' }}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="secondary">{open ? 'Open' : 'Closed'}</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Controlled">Controlled by the parent.</PopoverContent>
      </Popover>
      <Button variant="ghost" onClick={() => setOpen((value) => !value)}>
        Toggle from outside
      </Button>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const DisabledTrigger: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Never shown">Never shown</PopoverContent>
    </Popover>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open popover</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Keyboard">
        <Input aria-label="First field" />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('button');
    if (!trigger) throw new Error('No trigger');
    trigger.focus();
    trigger.click();
    await wait(300);
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) throw new Error('Popover did not open');
    if (!dialog.contains(document.activeElement))
      throw new Error('Focus did not enter the popover');
    if (trigger.getAttribute('aria-expanded') !== 'true')
      throw new Error('aria-expanded is not true');

    press(dialog, 'Escape');
    await wait(300);
    if (document.querySelector('[role="dialog"]')) throw new Error('Escape did not close');
    if (document.activeElement !== trigger) throw new Error('Focus did not return to the trigger');
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  args: { defaultOpen: true },
};
