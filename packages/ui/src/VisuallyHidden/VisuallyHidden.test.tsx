import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders its children in the document', () => {
    render(<VisuallyHidden>Skip to content</VisuallyHidden>);
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });

  it('forwards the ref to the span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<VisuallyHidden ref={ref}>Hidden</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes native props through', () => {
    render(<VisuallyHidden data-testid="vh">Hidden</VisuallyHidden>);
    expect(screen.getByTestId('vh')).toHaveTextContent('Hidden');
  });

  it('adds className to the base class instead of replacing it', () => {
    render(<VisuallyHidden className="extra">Hidden</VisuallyHidden>);
    expect(screen.getByText('Hidden')).toHaveClass('ds-visually-hidden', 'extra');
  });

  it('has a displayName', () => {
    expect(VisuallyHidden.displayName).toBe('VisuallyHidden');
  });

  it('with asChild applies the class to the child without an extra span', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <VisuallyHidden asChild ref={ref}>
        <label htmlFor="x">Name</label>
      </VisuallyHidden>,
    );
    const label = screen.getByText('Name');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('ds-visually-hidden');
    expect(container.querySelector('span')).toBeNull();
    expect(ref.current).toBe(label);
  });

  it('counts towards the accessible name of an icon-only button', async () => {
    const { container } = render(
      <button type="button">
        <svg aria-hidden="true" width="16" height="16" />
        <VisuallyHidden>Close</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
