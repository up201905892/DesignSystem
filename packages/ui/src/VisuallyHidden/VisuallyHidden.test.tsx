import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
