import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Alert } from './Alert';

const variants = ['info', 'success', 'warning', 'danger'] as const;
const roles = { info: 'status', success: 'status', warning: 'alert', danger: 'alert' } as const;

describe('Alert', () => {
  it('renders title and description', () => {
    render(<Alert title="Heads up">Something happened</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'info');
  });

  it.each(variants)('has the right role for %s', (variant) => {
    render(<Alert variant={variant}>x</Alert>);
    expect(screen.getByRole(roles[variant])).toHaveAttribute('data-variant', variant);
  });

  it('accepts a custom role', () => {
    render(
      <Alert variant="danger" role="status">
        x
      </Alert>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each(variants)('shows a decorative default icon for %s', (variant) => {
    const { container } = render(<Alert variant={variant}>x</Alert>);
    const wrapper = container.querySelector('.ds-alert-icon');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper?.querySelector('svg')).toBeInTheDocument();
  });

  it('uses a different icon for each variant', () => {
    const markup = variants.map((variant) => {
      const { container, unmount } = render(<Alert variant={variant}>x</Alert>);
      const html = container.querySelector('.ds-alert-icon svg')?.innerHTML;
      unmount();
      return html;
    });
    expect(new Set(markup).size).toBe(4);
  });

  it('accepts a custom icon', () => {
    render(<Alert icon={<span data-testid="mine" />}>x</Alert>);
    expect(screen.getByTestId('mine').closest('.ds-alert-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('removes the icon with icon={false}', () => {
    const { container } = render(<Alert icon={false}>x</Alert>);
    expect(container.querySelector('.ds-alert-icon')).toBeNull();
  });

  it('has no close button without onClose', () => {
    render(<Alert>x</Alert>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onClose once on click and does not hide itself', async () => {
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>x</Alert>);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses a custom closeLabel', () => {
    render(
      <Alert onClose={() => {}} closeLabel="Dismiss">
        x
      </Alert>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('omits title and description wrappers when absent', () => {
    const { container } = render(<Alert />);
    expect(container.querySelector('.ds-alert-title')).toBeNull();
    expect(container.querySelector('.ds-alert-description')).toBeNull();
  });

  it('forwards ref, className and native props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} className="mine" data-testid="a" id="x">
        x
      </Alert>,
    );
    expect(ref.current).toBe(screen.getByTestId('a'));
    expect(ref.current).toHaveClass('ds-alert', 'mine');
    expect(ref.current).toHaveAttribute('id', 'x');
    expect(Alert.displayName).toBe('Alert');
  });

  it('Tab focuses the close button; Enter and Space call onClose', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Alert onClose={onClose}>x</Alert>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it.each(variants)('has no axe violations (%s)', async (variant) => {
    const { container } = render(
      <Alert variant={variant} title="Title" onClose={() => {}}>
        Description
      </Alert>,
    );
    await expectNoA11yViolations(container);
  });
});
