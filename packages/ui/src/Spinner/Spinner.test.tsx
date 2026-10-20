import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('has role status and the default name "Loading"', () => {
    render(<Spinner />);
    const status = screen.getByRole('status', { name: 'Loading' });
    expect(status).toHaveClass('ds-spinner');
    expect(status).toHaveAttribute('data-size', 'md');
  });

  it('uses a custom label as its name', () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('size %s', (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-size', size);
  });

  it('hides the graphic and keeps the label in visually hidden text', () => {
    render(<Spinner label="Saving" />);
    const status = screen.getByRole('status');
    const svg = status.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Saving')).toHaveClass('ds-visually-hidden');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} className="extra" data-testid="s" />);
    expect(ref.current).toBe(screen.getByTestId('s'));
    expect(ref.current).toHaveClass('ds-spinner', 'extra');
  });

  it('has a displayName', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });

  it('does not take focus with Tab', async () => {
    render(<Spinner />);
    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner label="Saving" />);
    await expectNoA11yViolations(container);
  });
});
