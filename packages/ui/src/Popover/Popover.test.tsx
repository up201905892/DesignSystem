import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  type PopoverContentProps,
  type PopoverProps,
} from './Popover';

function Example({ content, ...props }: PopoverProps & { content?: Partial<PopoverContentProps> }) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button>Open</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filters" {...content}>
        <input aria-label="Name" />
        <PopoverClose asChild>
          <Button>Done</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('is closed by default', () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens and closes when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByRole('dialog')).toBeNull();
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
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('does not open in controlled mode if the parent keeps it closed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example open={false} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>Outside</button>
        <Example defaultOpen />
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes with PopoverClose', async () => {
    const user = userEvent.setup();
    render(<Example defaultOpen />);
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('has no close button unless showClose is set', () => {
    render(<Example defaultOpen />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('renders a close button with showClose and closeLabel', async () => {
    const user = userEvent.setup();
    render(<Example defaultOpen content={{ showClose: true }} />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('uses a custom closeLabel', () => {
    render(<Example defaultOpen content={{ showClose: true, closeLabel: 'Fechar' }} />);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
  });

  it('accepts aria-labelledby as the accessible name', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent aria-labelledby="title">
          <h2 id="title">Sort order</h2>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.getByRole('dialog', { name: 'Sort order' })).toBeInTheDocument();
  });

  it('applies side and align, with bottom and center by default', () => {
    const { unmount } = render(<Example defaultOpen />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-side', 'bottom');
    expect(dialog).toHaveAttribute('data-align', 'center');
    unmount();
    render(
      <Example defaultOpen content={{ side: 'right', align: 'start', avoidCollisions: false }} />,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'right');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-align', 'start');
  });

  it('forwards ref, className and props to the content', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Example
        defaultOpen
        content={{ ref, className: 'custom', 'data-testid': 'content' } as never}
      />,
    );
    const dialog = screen.getByRole('dialog');
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass('ds-popover', 'custom');
    expect(dialog).toHaveAttribute('data-testid', 'content');
  });

  it('is rendered in a portal', () => {
    const { container } = render(<Example defaultOpen />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('sets displayName on every part', () => {
    expect(Popover.name).toBe('Popover');
    expect(PopoverTrigger.displayName).toBe('PopoverTrigger');
    expect(PopoverContent.displayName).toBe('PopoverContent');
    expect(PopoverClose.displayName).toBe('PopoverClose');
  });
});

describe('Popover with a disabled trigger', () => {
  function Disabled({ onOpenChange, icon }: { onOpenChange: () => void; icon?: boolean }) {
    return (
      <>
        <button>Before</button>
        <Popover onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            {icon ? (
              <IconButton aria-label="Open" icon={<span />} disabled />
            ) : (
              <Button disabled>Open</Button>
            )}
          </PopoverTrigger>
          <PopoverContent aria-label="Never">Never</PopoverContent>
        </Popover>
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

describe('Popover accessibility', () => {
  it('has no axe violations when open', async () => {
    render(<Example defaultOpen content={{ showClose: true }} />);
    await expectNoA11yViolations(document.body);
  });

  it('has no axe violations when closed', async () => {
    render(<Example />);
    await expectNoA11yViolations(document.body);
  });

  it('gives the trigger haspopup, expanded and controls', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('dialog').id);
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])('opens with %s and moves the focus into the content', async (_name, key) => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard(key);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('Tab walks through the focusable elements of the content', async () => {
    const user = userEvent.setup();
    render(<Example content={{ showClose: true }} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    const focusable = [...dialog.querySelectorAll<HTMLElement>('input, button')];
    expect(focusable).toHaveLength(3);
    const seen: Element[] = [];
    for (let i = 0; i < 3; i += 1) {
      await user.tab();
      seen.push(document.activeElement as Element);
    }
    expect(seen.slice(0, 3).every((el) => dialog.contains(el))).toBe(true);
    expect(new Set(seen).size).toBeGreaterThan(1);
  });

  it('Esc closes and returns the focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('returns the focus to the trigger when PopoverClose is used', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(trigger).toHaveFocus();
  });
});
