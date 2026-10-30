import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../test/a11y';
import { Stack, type SpaceKey } from './Stack';

describe('Stack', () => {
  it('renders a div with the defaults and no role', () => {
    render(<Stack data-testid="s">x</Stack>);
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('ds-stack');
    expect(el).toHaveAttribute('data-direction', 'vertical');
    expect(el).toHaveAttribute('data-gap', '4');
    expect(el).not.toHaveAttribute('data-align');
    expect(el).not.toHaveAttribute('data-justify');
    expect(el).not.toHaveAttribute('data-wrap');
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('tabindex');
  });

  it('reflects direction', () => {
    render(<Stack direction="horizontal" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-direction', 'horizontal');
  });

  it.each([0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as SpaceKey[])('reflects gap %s', (gap) => {
    render(<Stack gap={gap} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-gap', String(gap));
  });

  it.each(['start', 'center', 'end', 'stretch', 'baseline'] as const)('reflects align %s', (a) => {
    render(<Stack align={a} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-align', a);
  });

  it.each(['start', 'center', 'end', 'between'] as const)('reflects justify %s', (j) => {
    render(<Stack justify={j} data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-justify', j);
  });

  it('reflects wrap', () => {
    render(<Stack wrap data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveAttribute('data-wrap', 'true');
  });

  it('rejects a gap outside the scale at compile time', () => {
    // @ts-expect-error 7 is not a key of the spacing scale
    render(<Stack gap={7} data-testid="s" />);
    expect(screen.getByTestId('s')).toBeInTheDocument();
  });

  it('adds className, forwards the ref and native props, and has a displayName', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stack ref={ref} className="extra" data-testid="s" title="t">
        x
      </Stack>,
    );
    expect(ref.current).toBe(screen.getByTestId('s'));
    expect(ref.current).toHaveClass('ds-stack', 'extra');
    expect(ref.current).toHaveAttribute('title', 't');
    expect(Stack.displayName).toBe('Stack');
  });

  it('renders the child element with asChild and keeps <li> as direct children', () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <Stack asChild gap={2} className="extra">
        <ul ref={ref}>
          <li>One</li>
          <li>Two</li>
        </ul>
      </Stack>,
    );
    const list = screen.getByRole('list');
    expect(ref.current).toBe(list);
    expect(list).toHaveClass('ds-stack', 'extra');
    expect(list).toHaveAttribute('data-gap', '2');
    expect(Array.from(list.children).map((c) => c.tagName)).toEqual(['LI', 'LI']);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('keeps the DOM order and is skipped by Tab', async () => {
    render(
      <Stack direction="horizontal">
        <button>A</button>
        <button>B</button>
      </Stack>,
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByText('A')).toHaveFocus();
    await user.tab();
    expect(screen.getByText('B')).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Stack asChild>
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </Stack>,
    );
    await expectNoA11yViolations(container);
  });
});
