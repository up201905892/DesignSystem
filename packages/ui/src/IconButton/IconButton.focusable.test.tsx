/* The icon is rendered inside the anchor by IconButton (asChild). */
/* eslint-disable jsx-a11y/anchor-has-content */
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { IconButton } from './IconButton';

const Icon = () => <svg width="16" height="16" />;

describe('IconButton focusableWhenDisabled (DS-056)', () => {
  it('passes the prop to Button: attributes, blocked click and focusable', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <IconButton
        aria-label="Next"
        icon={<Icon />}
        disabled
        focusableWhenDisabled
        onClick={onClick}
      />,
    );
    const button = screen.getByRole('button', { name: 'Next' });
    expect(button).not.toHaveAttribute('disabled');
    expect(button).not.toHaveAttribute('tabindex');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-disabled');
    expect(button).toHaveAttribute('data-icon-only');
    await user.tab();
    expect(button).toHaveFocus();
    await user.click(button);
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
    await expectNoA11yViolations(container);
  });

  it('asChild keeps the link focusable and blocks navigation', () => {
    render(
      <IconButton asChild aria-label="Settings" icon={<Icon />} disabled focusableWhenDisabled>
        <a href="/settings" />
      </IconButton>,
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).not.toHaveAttribute('tabindex');
    expect(fireEvent.click(link)).toBe(false);
  });
});
