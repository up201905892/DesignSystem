import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Input } from '../Input';
import { Button } from './Button';

describe('Button focusableWhenDisabled (DS-056)', () => {
  it('has no effect without disabled', () => {
    render(<Button focusableWhenDisabled>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toHaveAttribute('aria-disabled');
    expect(button).not.toHaveAttribute('data-disabled');
    expect(button).not.toBeDisabled();
  });

  it('keeps a native button without the disabled attribute and blocks the click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled focusableWhenDisabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toHaveAttribute('disabled');
    expect(button).not.toHaveAttribute('tabindex');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-disabled');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not submit the form by click or by Enter in a field of the same form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Input aria-label="Name" />
        <Button type="submit" disabled focusableWhenDisabled>
          Send
        </Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'x{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('asChild: aria-disabled, no tabindex, navigation prevented', () => {
    const onClick = vi.fn();
    render(
      <Button asChild disabled focusableWhenDisabled onClick={onClick}>
        <a href="/x">Docs</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('data-disabled');
    expect(link).not.toHaveAttribute('tabindex');
    expect(fireEvent.click(link)).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('stays focusable with loading + disabled + focusableWhenDisabled', async () => {
    const user = userEvent.setup();
    render(
      <Button loading disabled focusableWhenDisabled>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toHaveAttribute('disabled');
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.tab();
    expect(button).toHaveFocus();
  });

  it('is reached by Tab and Enter and Space do not call onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled focusableWhenDisabled onClick={onClick}>
        Save
      </Button>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).not.toHaveBeenCalled();
  });

  function Toggle({ focusable }: { focusable: boolean }) {
    const [off, setOff] = useState(false);
    return (
      <Button disabled={off} focusableWhenDisabled={focusable} onClick={() => setOff(true)}>
        Next
      </Button>
    );
  }

  it('keeps the focus when the focused button becomes disabled with the prop', async () => {
    const user = userEvent.setup();
    render(<Toggle focusable />);
    const button = screen.getByRole('button', { name: 'Next' });
    await user.tab();
    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(document.activeElement).toBe(button);
  });

  it('without the prop the focus leaves the button when it becomes disabled (current behaviour)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toggle focusable={false} />
        <button type="button">Other</button>
      </>,
    );
    const button = screen.getByRole('button', { name: 'Next' });
    await user.tab();
    await user.keyboard('{Enter}');
    expect(button).toBeDisabled();
    // jsdom keeps `activeElement` on the disabled button, but it is no longer tabbable:
    // moving away and coming back never lands on it again (browsers drop the focus).
    await user.tab();
    expect(screen.getByRole('button', { name: 'Other' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(document.activeElement).not.toBe(button);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Button disabled focusableWhenDisabled>
        Save
      </Button>,
    );
    await expectNoA11yViolations(container);
  });
});
