import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Field, FieldLabel } from '../Field';
import { Input } from '../Input';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>A short description of what this dialog is for.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>Content of the dialog.</p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const press = (target: Element, key: string, shiftKey = false) =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }),
  );

export const Default: Story = { args: { defaultOpen: true } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="secondary">Open {size}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size {size}</DialogTitle>
              <DialogDescription>Dialog with size {size}.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p>Content of the dialog.</p>
            </DialogBody>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change your details and save.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' }}>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input defaultValue="Ada Lovelace" />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" defaultValue="ada@example.com" />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Terms</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Scroll to read everything.</DialogDescription>
        </DialogHeader>
        <DialogBody tabIndex={0}>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>
              Paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="danger">Delete project</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="danger">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const NoOverlayClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent closeOnOverlayClick={false}>
        <DialogHeader>
          <DialogTitle>Click outside</DialogTitle>
          <DialogDescription>Clicking the overlay does not close this dialog.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const DisabledTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Never shown</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard</DialogTitle>
          <DialogDescription>Tab stays inside; Esc closes.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Input aria-label="First field" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('button');
    if (!trigger) throw new Error('No trigger');
    trigger.focus();
    trigger.click();
    await wait(300);
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) throw new Error('Dialog did not open');
    const focusable = [...dialog.querySelectorAll<HTMLElement>('button, input')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) throw new Error('No focusable elements');
    if (!dialog.contains(document.activeElement)) throw new Error('Focus did not enter the dialog');

    last.focus();
    press(last, 'Tab');
    await wait(50);
    if (document.activeElement !== first) throw new Error('Tab did not wrap to the first element');

    press(first, 'Tab', true);
    await wait(50);
    if (document.activeElement !== last)
      throw new Error('Shift+Tab did not wrap to the last element');

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
