import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Grid, GridItem } from './Grid';

describe('Grid', () => {
  it('renders a div with the defaults and no role', () => {
    render(<Grid data-testid="g">x</Grid>);
    const el = screen.getByTestId('g');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('ds-grid');
    expect(el).toHaveAttribute('data-columns', '1');
    expect(el).toHaveAttribute('data-gap', '4');
    expect(el).not.toHaveAttribute('data-responsive');
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('tabindex');
    expect(el.getAttribute('style')).toBeNull();
  });

  it.each([1, 2, 3, 4, 6, 12] as const)('reflects columns %s', (n) => {
    render(<Grid columns={n} data-testid="g" />);
    expect(screen.getByTestId('g')).toHaveAttribute('data-columns', String(n));
  });

  it.each([0, 2, 16] as const)('reflects gap %s', (gap) => {
    render(<Grid gap={gap} data-testid="g" />);
    expect(screen.getByTestId('g')).toHaveAttribute('data-gap', String(gap));
  });

  it('sets the custom property for minColumnWidth and drops data-columns', () => {
    render(<Grid minColumnWidth="12rem" data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el).toHaveAttribute('data-responsive', 'true');
    expect(el).not.toHaveAttribute('data-columns');
    expect(el.style.getPropertyValue('--ds-grid-min-column')).toBe('12rem');
  });

  it('keeps the consumer style next to the custom property', () => {
    render(<Grid minColumnWidth="10rem" style={{ margin: 0 }} data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.style.getPropertyValue('--ds-grid-min-column')).toBe('10rem');
    expect(el.style.margin).toBe('0px');
  });

  it('rejects invalid props at compile time', () => {
    // @ts-expect-error 7 is not a key of the spacing scale
    render(<Grid gap={7} />);
    // @ts-expect-error 5 is not a supported column count
    render(<Grid columns={5} />);
    // @ts-expect-error columns and minColumnWidth are mutually exclusive
    render(<Grid columns={2} minColumnWidth="10rem" />);
  });

  it('adds className, forwards the ref and native props, and has a displayName', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Grid ref={ref} className="extra" data-testid="g" title="t">
        x
      </Grid>,
    );
    expect(ref.current).toBe(screen.getByTestId('g'));
    expect(ref.current).toHaveClass('ds-grid', 'extra');
    expect(ref.current).toHaveAttribute('title', 't');
    expect(Grid.displayName).toBe('Grid');
    expect(GridItem.displayName).toBe('GridItem');
  });

  it('renders the child element with asChild and keeps <li> as direct children', () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <Grid asChild columns={2}>
        <ul ref={ref}>
          <GridItem asChild>
            <li>One</li>
          </GridItem>
          <li>Two</li>
        </ul>
      </Grid>,
    );
    const list = screen.getByRole('list');
    expect(ref.current).toBe(list);
    expect(list).toHaveClass('ds-grid');
    expect(list).toHaveAttribute('data-columns', '2');
    expect(Array.from(list.children).map((c) => c.tagName)).toEqual(['LI', 'LI']);
  });

  it('keeps the DOM order and is skipped by Tab', async () => {
    render(
      <Grid columns={2}>
        <button>A</button>
        <button>B</button>
      </Grid>,
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByText('A')).toHaveFocus();
    await user.tab();
    expect(screen.getByText('B')).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Grid asChild>
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </Grid>,
    );
    await expectNoA11yViolations(container);
  });
});

describe('GridItem', () => {
  it('renders a div without span by default', () => {
    render(<GridItem data-testid="i">x</GridItem>);
    const el = screen.getByTestId('i');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('ds-grid-item');
    expect(el).not.toHaveAttribute('data-col-span');
    expect(el).not.toHaveAttribute('role');
  });

  it('reflects colSpan in the data attribute and the custom property', () => {
    render(<GridItem colSpan={2} data-testid="i" />);
    const el = screen.getByTestId('i');
    expect(el).toHaveAttribute('data-col-span', '2');
    expect(el.style.getPropertyValue('--ds-grid-col-span')).toBe('2');
  });

  it('adds className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<GridItem ref={ref} className="extra" data-testid="i" />);
    expect(ref.current).toBe(screen.getByTestId('i'));
    expect(ref.current).toHaveClass('ds-grid-item', 'extra');
  });
});
