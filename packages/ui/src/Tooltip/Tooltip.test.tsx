import { createRef, useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button';
import { Tooltip, TooltipProvider } from './Tooltip';

const hover = () =>
  fireEvent.pointerMove(screen.getByRole('button', { name: 'Trigger' }), {
    pointerType: 'mouse',
  });

afterEach(() => {
  vi.useRealTimers();
});

describe('Tooltip', () => {
  it('is closed by default and keeps the content out of the DOM', () => {
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows the content with defaultOpen, in a role="tooltip" element', () => {
    render(
      <Tooltip content="Help text" defaultOpen>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Help text');
  });

  it('exposes the side in data-side and defaults to top', async () => {
    const { rerender } = render(
      <Tooltip content="Help" defaultOpen>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(document.querySelector('.ds-tooltip')).toHaveAttribute('data-side', 'top');
    rerender(
      <Tooltip content="Help" defaultOpen side="right" avoidCollisions={false}>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    await waitFor(() =>
      expect(document.querySelector('.ds-tooltip')).toHaveAttribute('data-side', 'right'),
    );
  });

  it('renders in a portal outside the container', () => {
    const { container } = render(
      <Tooltip content="Help text" defaultOpen>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(container).not.toContainElement(document.querySelector('.ds-tooltip'));
  });

  it('supports the controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Tooltip
          content="Help text"
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <Button>Trigger</Button>
        </Tooltip>
      );
    }
    render(<Controlled />);
    await user.tab();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('stays closed when open is false, whatever the user does', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text" open={false}>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on keyboard focus and describes the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).not.toHaveAttribute('aria-describedby');
    await user.tab();
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(trigger).toHaveAccessibleDescription('Help text');
    expect(trigger).toHaveAccessibleName('Trigger');
  });

  it('closes with Esc and keeps the focus on the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
  });

  it('closes when the focus leaves the trigger', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content="Help text">
          <Button>First</Button>
        </Tooltip>
        <Button>Second</Button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on hover only after the delay (400 ms by default)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    hover();
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('respects a custom delayDuration', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Help text" delayDuration={50}>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    hover();
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('does not close on its own after time passes', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    hover();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('closes with Esc after opening on hover', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    hover();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('forwards ref and className to the content and merges the base class', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tooltip content="Help text" defaultOpen ref={ref} className="custom" data-testid="tip">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ds-tooltip', 'custom');
    expect(ref.current).toHaveAttribute('data-testid', 'tip');
  });

  it('has a displayName', () => {
    expect(Tooltip.displayName).toBe('Tooltip');
  });

  it('works inside a TooltipProvider', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={100}>
        <Tooltip content="One">
          <Button>First</Button>
        </Tooltip>
        <Tooltip content="Two">
          <Button>Second</Button>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent('One');
    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Two');
  });

  it('accepts ReactNode content', () => {
    render(
      <Tooltip content={<strong>Bold</strong>} defaultOpen>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toContainHTML('<strong>Bold</strong>');
  });

  it('has no axe violations when open', async () => {
    const { container } = render(
      <Tooltip content="Help text" defaultOpen>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    await expectNoA11yViolations(container);
    await expectNoA11yViolations(screen.getByRole('tooltip'));
  });

  it('has no axe violations when closed', async () => {
    const { container } = render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    await expectNoA11yViolations(container);
  });
});
