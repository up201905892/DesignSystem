import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

afterEach(() => {
  vi.useRealTimers();
});

describe('Tooltip (edge cases)', () => {
  it('stays open while the pointer is over the content (WCAG 1.4.13 hoverable)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Help text">
        <Button>Trigger</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const content = document.querySelector('.ds-tooltip') as HTMLElement;
    expect(content).toBeInTheDocument();
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    fireEvent.pointerEnter(content, { pointerType: 'mouse' });
    fireEvent.pointerMove(content, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(document.querySelector('.ds-tooltip')).toBeInTheDocument();
  });

  it('removes aria-describedby from the trigger when closed', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content="Help text">
          <Button>Trigger</Button>
        </Tooltip>
        <Button>Other</Button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).not.toHaveAttribute('aria-describedby');
    await user.tab();
    expect(trigger).toHaveAttribute('aria-describedby');
    await user.keyboard('{Escape}');
    expect(trigger).not.toHaveAttribute('aria-describedby');
    expect(trigger).toHaveFocus();
  });

  it('wraps a very long word and has no axe violations in the dark theme', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { container } = render(
      <Tooltip defaultOpen content={'x'.repeat(300)}>
        <Button>Trigger</Button>
      </Tooltip>,
    );
    expect(document.querySelector('.ds-tooltip')).toHaveTextContent('x'.repeat(300));
    await expectNoA11yViolations(container);
    document.documentElement.removeAttribute('data-theme');
  });
});
