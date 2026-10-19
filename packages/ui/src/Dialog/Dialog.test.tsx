import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
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
  type DialogContentProps,
  type DialogProps,
} from './Dialog';

function Example({ content, ...props }: DialogProps & { content?: Partial<DialogContentProps> }) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent {...content}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change your details.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <input aria-label="Name" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('is closed by default', () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog', { name: 'Edit profile' })).toBeInTheDocument();
  });

  it('starts open with defaultOpen', () => {
    render(<Example defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
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
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not change in controlled mode unless the parent updates', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example open onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) from the close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example defaultOpen onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange(false) from DialogClose', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example defaultOpen onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on overlay click by default', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example defaultOpen onOpenChange={onOpenChange} />);
    const overlay = document.querySelector<HTMLElement>('.ds-dialog__overlay');
    expect(overlay).not.toBeNull();
    await user.click(overlay as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps open on overlay click with closeOnOverlayClick={false}', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Example defaultOpen onOpenChange={onOpenChange} content={{ closeOnOverlayClick: false }} />,
    );
    await user.click(document.querySelector('.ds-dialog__overlay') as HTMLElement);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('hideClose removes the close button', () => {
    render(<Example defaultOpen content={{ hideClose: true }} />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('uses closeLabel as the name of the close button', () => {
    render(<Example defaultOpen content={{ closeLabel: 'Fechar' }} />);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
  });

  it('exposes size in data-size (md by default)', () => {
    const { rerender } = render(<Example defaultOpen />);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'md');
    rerender(<Example defaultOpen content={{ size: 'lg' }} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'lg');
  });

  it('forwards ref and className to the content', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Dialog defaultOpen>
        <DialogContent ref={ref} className="custom">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(ref.current).toBe(screen.getByRole('dialog'));
    expect(ref.current).toHaveClass('ds-dialog', 'custom');
  });

  it('sets display names', () => {
    expect(DialogContent.displayName).toBe('DialogContent');
    expect(DialogTitle.displayName).toBe('DialogTitle');
    expect(DialogTrigger.displayName).toBe('DialogTrigger');
  });

  it('is named by the title and described by the description', () => {
    render(<Example defaultOpen />);
    const dialog = screen.getByRole('dialog', { name: 'Edit profile' });
    expect(dialog).toHaveAccessibleDescription('Change your details.');
  });

  it('has no aria-describedby and no warning without a description', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Only title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('is rendered in a portal, outside the container', () => {
    const { container } = render(<Example defaultOpen />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('makes the content behind inaccessible while open', () => {
    const { container } = render(<Example defaultOpen />);
    expect(screen.queryByRole('button', { name: 'Open' })).toBeNull();
    expect(container).toHaveAttribute('aria-hidden', 'true');
  });

  it('locks the page scroll while open', () => {
    render(<Example defaultOpen />);
    expect(document.body).toHaveAttribute('data-scroll-locked');
  });
});

describe('Dialog keyboard and focus', () => {
  it('moves focus into the dialog when opened', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  });

  it('traps focus: Tab on the last element goes to the first and Shift+Tab back', async () => {
    const user = userEvent.setup();
    render(<Example defaultOpen />);
    const first = screen.getByRole('textbox', { name: 'Name' });
    const last = screen.getByRole('button', { name: 'Close' });
    first.focus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it('closes with Esc and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('opens with Enter and Space on the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await user.keyboard(' ');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('Dialog with a disabled trigger', () => {
  function Disabled({ onOpenChange, icon }: { onOpenChange: () => void; icon?: boolean }) {
    return (
      <>
        <button>Before</button>
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            {icon ? (
              <IconButton aria-label="Open" icon={<span />} disabled />
            ) : (
              <Button disabled>Open</Button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Never</DialogTitle>
          </DialogContent>
        </Dialog>
        <button>After</button>
      </>
    );
  }

  it.each([false, true])('does not open (icon button: %s)', async (icon) => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Disabled onOpenChange={onOpenChange} icon={icon} />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    trigger.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('is skipped by Tab', async () => {
    const user = userEvent.setup();
    render(<Disabled onOpenChange={vi.fn()} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('Dialog accessibility', () => {
  it('has no axe violations when open', async () => {
    render(<Example defaultOpen />);
    await expectNoA11yViolations(document.body);
  });

  it('has role dialog and aria-modal', () => {
    render(<Example defaultOpen />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
