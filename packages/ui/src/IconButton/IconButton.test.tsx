/* The icon is rendered inside the anchor by IconButton (asChild). */
/* eslint-disable jsx-a11y/anchor-has-content */
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { IconButton } from './IconButton';

const Icon = () => <svg data-testid="icon" width="16" height="16" />;

describe('IconButton', () => {
  it('renders a button with the icon hidden from assistive tech', () => {
    render(<IconButton aria-label="Close" icon={<Icon />} />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('ds-button');
    expect(button).toHaveAttribute('data-icon-only');
    const wrapper = screen.getByTestId('icon').parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(button).toContainElement(wrapper);
  });

  it('sets variant and size data attributes', () => {
    render(<IconButton aria-label="x" icon={<Icon />} variant="danger" size="lg" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} className="extra" aria-label="x" icon={<Icon />} />);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveClass('ds-button', 'extra');
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="x" icon={<Icon />} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('accepts aria-labelledby instead of aria-label', () => {
    render(
      <>
        <span id="lbl">Delete</span>
        <IconButton aria-labelledby="lbl" icon={<Icon />} />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('requires an accessible name at compile time', () => {
    // @ts-expect-error aria-label or aria-labelledby is required
    const missing = <IconButton icon={<Icon />} />;
    expect(missing).toBeTruthy();
  });

  it('uses the native disabled attribute and leaves the Tab order', async () => {
    render(<IconButton aria-label="x" icon={<Icon />} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.tab();
    expect(button).not.toHaveFocus();
  });

  it('works with the keyboard', async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Close" icon={<Icon />} onClick={onClick} />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  describe('asChild', () => {
    it('renders the child with the icon inside and the label on the child', () => {
      render(
        <IconButton asChild aria-label="Settings" icon={<Icon />}>
          <a href="/x" />
        </IconButton>,
      );
      const link = screen.getByRole('link', { name: 'Settings' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveClass('ds-button');
      expect(link).toHaveAttribute('data-icon-only');
      expect(link.querySelector('span[aria-hidden="true"]')).toContainElement(
        screen.getByTestId('icon'),
      );
    });

    it('adds no wrapper around the child and puts aria-label on it', () => {
      const { container } = render(
        <IconButton asChild aria-label="Settings" icon={<Icon />}>
          <a href="/x" />
        </IconButton>,
      );
      expect(container.children).toHaveLength(1);
      expect(container.firstElementChild?.tagName).toBe('A');
      expect(container.firstElementChild).toHaveAttribute('aria-label', 'Settings');
      expect(container.firstElementChild).not.toHaveAttribute('type');
    });

    it('blocks clicks and leaves the Tab order when disabled', async () => {
      const outer = vi.fn();
      const inner = vi.fn();
      render(
        <IconButton asChild disabled aria-label="Settings" icon={<Icon />} onClick={outer}>
          <a href="/x" onClick={inner} />
        </IconButton>,
      );
      const link = screen.getByRole('link', { name: 'Settings' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-disabled');
      expect(link).toHaveAttribute('tabindex', '-1');
      expect(link).not.toHaveAttribute('disabled');
      const notCancelled = fireEvent.click(link);
      expect(notCancelled).toBe(false);
      expect(outer).not.toHaveBeenCalled();
      expect(inner).not.toHaveBeenCalled();
      await userEvent.tab();
      expect(link).not.toHaveFocus();
    });
  });

  it('has no axe violations', async () => {
    const { container, rerender } = render(<IconButton aria-label="Close" icon={<Icon />} />);
    await expectNoA11yViolations(container);
    rerender(
      <IconButton asChild aria-label="Settings" icon={<Icon />}>
        <a href="/x" />
      </IconButton>,
    );
    await expectNoA11yViolations(container);
    rerender(
      <IconButton asChild disabled aria-label="Settings" icon={<Icon />}>
        <a href="/x" />
      </IconButton>,
    );
    await expectNoA11yViolations(container);
  });
});
