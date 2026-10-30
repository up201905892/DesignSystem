import { createRef } from 'react';
import { isInaccessible, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a hidden text skeleton by default', () => {
    render(<Skeleton data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el).toHaveClass('ds-skeleton');
    expect(el).toHaveAttribute('data-variant', 'text');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.querySelectorAll('.ds-skeleton__line')).toHaveLength(0);
  });

  it.each(['text', 'rect', 'circle'] as const)('variant %s', (variant) => {
    render(<Skeleton variant={variant} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-variant', variant);
  });

  it('renders three lines with lines={3}', () => {
    render(<Skeleton lines={3} data-testid="s" />);
    expect(screen.getByTestId('s').querySelectorAll('.ds-skeleton__line')).toHaveLength(3);
  });

  it('ignores lines for other variants', () => {
    render(<Skeleton variant="rect" lines={3} data-testid="s" />);
    expect(screen.getByTestId('s').querySelectorAll('.ds-skeleton__line')).toHaveLength(0);
  });

  it('passes width and height to the custom properties', () => {
    render(<Skeleton width={120} height="2rem" data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el.style.getPropertyValue('--ds-skeleton-width')).toBe('120px');
    expect(el.style.getPropertyValue('--ds-skeleton-height')).toBe('2rem');
  });

  it('sets no custom properties when width and height are omitted', () => {
    render(<Skeleton data-testid="s" />);
    const el = screen.getByTestId('s');
    expect(el.style.getPropertyValue('--ds-skeleton-width')).toBe('');
    expect(el.style.getPropertyValue('--ds-skeleton-height')).toBe('');
  });

  it('keeps the consumer style', () => {
    render(<Skeleton width={10} style={{ margin: 0 }} data-testid="s" />);
    expect(screen.getByTestId('s').style.margin).toBe('0px');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} className="extra" data-testid="s" />);
    expect(ref.current).toBe(screen.getByTestId('s'));
    expect(ref.current).toHaveClass('ds-skeleton', 'extra');
  });

  it('has a displayName', () => {
    expect(Skeleton.displayName).toBe('Skeleton');
  });

  it('is not in the accessibility tree', () => {
    render(<Skeleton lines={2} data-testid="s" />);
    expect(isInaccessible(screen.getByTestId('s'))).toBe(true);
  });

  it('does not take focus with Tab', async () => {
    render(<Skeleton lines={2} />);
    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Skeleton lines={3} />);
    await expectNoA11yViolations(container);
  });
});
