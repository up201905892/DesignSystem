import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Badge } from './Badge';

const variants = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const;
const appearances = ['subtle', 'solid'] as const;

describe('Badge', () => {
  it('renders its text in a span with defaults', () => {
    render(<Badge>Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('ds-badge');
    expect(badge).toHaveAttribute('data-variant', 'neutral');
    expect(badge).toHaveAttribute('data-appearance', 'subtle');
    expect(badge).toHaveAttribute('data-size', 'md');
  });

  it.each(variants)('variant %s', (variant) => {
    render(<Badge variant={variant}>x</Badge>);
    expect(screen.getByText('x')).toHaveAttribute('data-variant', variant);
  });

  it.each(appearances)('appearance %s', (appearance) => {
    render(<Badge appearance={appearance}>x</Badge>);
    expect(screen.getByText('x')).toHaveAttribute('data-appearance', appearance);
  });

  it.each(['sm', 'md'] as const)('size %s', (size) => {
    render(<Badge size={size}>x</Badge>);
    expect(screen.getByText('x')).toHaveAttribute('data-size', size);
  });

  it('adds className to the base class', () => {
    render(<Badge className="extra">x</Badge>);
    expect(screen.getByText('x')).toHaveClass('ds-badge', 'extra');
  });

  it('forwards the ref, native props and has a displayName', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} data-testid="b" title="t">
        x
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId('b')).toHaveAttribute('title', 't');
    expect(Badge.displayName).toBe('Badge');
  });

  it('has no role of its own', () => {
    render(<Badge>x</Badge>);
    expect(screen.getByText('x')).not.toHaveAttribute('role');
  });

  it('renders the child element with asChild', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Badge asChild variant="primary" className="extra">
        <a href="/docs" ref={ref}>
          Docs
        </a>
      </Badge>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('ds-badge', 'extra');
    expect(link).toHaveAttribute('data-variant', 'primary');
    expect(link).toHaveAttribute('href', '/docs');
    expect(ref.current).toBe(link);
  });

  it.each(variants.flatMap((v) => appearances.map((a) => [v, a] as const)))(
    'has no axe violations for %s %s',
    async (variant, appearance) => {
      const { container } = render(
        <Badge variant={variant} appearance={appearance}>
          Active
        </Badge>,
      );
      await expectNoA11yViolations(container);
      expect(screen.getByText('Active')).toBeInTheDocument();
    },
  );
});
