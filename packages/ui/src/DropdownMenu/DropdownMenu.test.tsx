import { createRef, useState, type Ref } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
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
  type DropdownMenuContentProps,
  type DropdownMenuProps,
} from './DropdownMenu';

function Example({
  content,
  onSelect = () => {},
  ...props
}: DropdownMenuProps & {
  content?: DropdownMenuContentProps & { ref?: Ref<HTMLDivElement> };
  onSelect?: () => void;
}) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...content}>
        <DropdownMenuItem onSelect={onSelect}>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled onSelect={onSelect}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSelect}>Archive</DropdownMenuItem>
        <DropdownMenuItem variant="danger" onSelect={onSelect}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const trigger = () => screen.getByRole('button', { name: 'Actions' });
const item = (name: string) => screen.getByRole('menuitem', { name });

describe('DropdownMenu', () => {
  it('is closed by default', () => {
    render(<Example />);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });

  it('starts open with defaultOpen', () => {
    render(<Example defaultOpen />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('calls onSelect, closes the menu and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);
    await user.click(trigger());
    await user.click(item('Edit'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(trigger()).toHaveFocus();
  });

  it('does not call onSelect on a disabled item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);
    await user.click(trigger());
    expect(item('Duplicate')).toHaveAttribute('aria-disabled', 'true');
    await user.click(item('Duplicate'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('works in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Example
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await user.click(trigger());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('stays closed when controlled with open={false}', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example open={false} onOpenChange={onOpenChange} />);
    await user.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(document.body);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('renders label, group and separator with the right roles', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(trigger());
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders in a portal on the dropdown layer with default side and align', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.click(trigger());
    const menu = screen.getByRole('menu');
    expect(container).not.toContainElement(menu);
    expect(menu).toHaveClass('ds-dropdown-menu');
    expect(menu).toHaveAttribute('data-side', 'bottom');
    expect(menu).toHaveAttribute('data-align', 'start');
  });

  it('accepts side and align', () => {
    render(<Example defaultOpen content={{ side: 'top', align: 'end' }} />);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('data-side', 'top');
    expect(menu).toHaveAttribute('data-align', 'end');
  });

  it('forwards ref and className, and sets variant and displayName', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Example defaultOpen content={{ ref, className: 'custom' }} />);
    expect(ref.current).toBe(screen.getByRole('menu'));
    expect(screen.getByRole('menu')).toHaveClass('custom');
    expect(item('Edit')).toHaveAttribute('data-variant', 'default');
    expect(item('Delete')).toHaveAttribute('data-variant', 'danger');
    expect(DropdownMenuContent.displayName).toBe('DropdownMenuContent');
    expect(DropdownMenuItem.displayName).toBe('DropdownMenuItem');
  });

  it('renders a decorative leading icon', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem leadingIcon={<svg data-testid="icon" />}>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(item('Edit')).toBeInTheDocument();
  });

  describe('keyboard', () => {
    it.each([['{Enter}'], [' '], ['{ArrowDown}']])(
      'opens with %j on the trigger and focuses the first item',
      async (key) => {
        const user = userEvent.setup();
        render(<Example />);
        await user.tab();
        expect(trigger()).toHaveFocus();
        await user.keyboard(key);
        expect(screen.getByRole('menu')).toBeInTheDocument();
        await waitFor(() => expect(item('Edit')).toHaveFocus());
        expect(item('Edit')).toHaveAttribute('data-highlighted');
      },
    );

    it('moves with arrows skipping disabled items, and Home and End', async () => {
      const user = userEvent.setup();
      render(<Example />);
      await user.tab();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(item('Edit')).toHaveFocus());
      await user.keyboard('{ArrowDown}');
      expect(item('Archive')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(item('Delete')).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(item('Archive')).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(item('Edit')).toHaveFocus();
      await user.keyboard('{End}');
      expect(item('Delete')).toHaveFocus();
      await user.keyboard('{Home}');
      expect(item('Edit')).toHaveFocus();
    });

    it('focuses the item that starts with the typed letter', async () => {
      const user = userEvent.setup();
      render(<Example />);
      await user.tab();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(item('Edit')).toHaveFocus());
      await user.keyboard('d');
      expect(item('Delete')).toHaveFocus();
    });

    it.each([['{Enter}'], [' ']])('activates the focused item with %j and closes', async (key) => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Example onSelect={onSelect} />);
      await user.tab();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(item('Edit')).toHaveFocus());
      await user.keyboard(key);
      expect(onSelect).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      expect(trigger()).toHaveFocus();
    });

    it('closes with Esc and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      render(<Example />);
      await user.tab();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(item('Edit')).toHaveFocus());
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      expect(trigger()).toHaveFocus();
    });

    it('closes with Tab', async () => {
      const user = userEvent.setup();
      render(<Example />);
      await user.tab();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(item('Edit')).toHaveFocus());
      await user.tab();
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });
  });

  describe('disabled trigger', () => {
    function Disabled({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
      return (
        <>
          <button>Before</button>
          <DropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button disabled>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button>After</button>
        </>
      );
    }

    it('does not open with click, Enter, Space or Arrow Down', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<Disabled onOpenChange={onOpenChange} />);
      await user.click(trigger());
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      await user.keyboard('{ArrowDown}');
      trigger().focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      await user.keyboard('{ArrowDown}');
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('menu')).toBeNull();
    });

    it('is skipped by Tab', async () => {
      const user = userEvent.setup();
      render(<Disabled onOpenChange={() => {}} />);
      await user.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      expect(screen.queryByRole('menu')).toBeNull();
    });

    it('works the same with a disabled IconButton', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild>
            <IconButton aria-label="More" icon={<svg />} disabled />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'More' }));
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('menu')).toBeNull();
    });
  });

  it('has no axe violations with the menu open', async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await expectNoA11yViolations(screen.getByRole('menu'));
  });
});
