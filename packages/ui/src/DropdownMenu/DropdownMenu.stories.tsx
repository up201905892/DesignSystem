import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { EllipsisIcon, PencilIcon, SettingsIcon, Trash2Icon, UserIcon } from '@up201905892/icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minHeight: '16rem' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Default: Story = { args: { defaultOpen: true } };

export const WithIcons: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem leadingIcon={<UserIcon />}>Profile</DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<SettingsIcon />}>Settings</DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<PencilIcon />}>Rename</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithGroupsAndLabels: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Team</DropdownMenuLabel>
          <DropdownMenuItem>Invite members</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const DisabledItem: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>Duplicate (unavailable)</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const DangerItem: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem leadingIcon={<PencilIcon />}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" leadingIcon={<Trash2Icon />}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const OnIconButton: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <IconButton variant="ghost" aria-label="More actions" icon={<EllipsisIcon />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const DisabledTrigger: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" disabled>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Never shown</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Actions' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const menu = await within(document.body).findByRole('menu');
    const items = within(menu).getAllByRole('menuitem');
    const [first, , last] = items;
    if (!first || !last) throw new Error('Items missing');
    await waitFor(() => expect(first).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}');
    await expect(last).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    await expect(first).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('menu')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Offset: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" sideOffset="3">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await wait(300);
    const trigger = canvasElement.querySelector<HTMLElement>('button');
    const menu = document.querySelector<HTMLElement>('[role="menu"]');
    if (!trigger || !menu) throw new Error('Menu did not open');
    const probe = document.createElement('div');
    probe.style.height = 'var(--ds-space-3)';
    document.body.append(probe);
    const expected = probe.getBoundingClientRect().height;
    probe.remove();
    const gap = menu.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom;
    if (Math.abs(gap - expected) > 1) throw new Error(`Gap is ${gap}px, expected ${expected}px`);
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem leadingIcon={<PencilIcon />}>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" leadingIcon={<Trash2Icon />}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
