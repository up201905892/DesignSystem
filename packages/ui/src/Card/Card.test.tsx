import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const full = (
  <Card data-testid="card">
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardBody>Body</CardBody>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Card>
);

describe('Card', () => {
  it('renders all the parts', () => {
    render(full);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('has default data attributes and no role or tabindex', () => {
    render(full);
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-variant', 'outlined');
    expect(card).toHaveAttribute('data-padding', 'md');
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');
  });

  it('applies variant and padding', () => {
    render(
      <Card variant="elevated" padding="lg" data-testid="card">
        x
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveAttribute('data-variant', 'elevated');
    expect(screen.getByTestId('card')).toHaveAttribute('data-padding', 'lg');
  });

  it('renders an h3 title by default and honours as', () => {
    const { rerender } = render(<CardTitle>T</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    rerender(<CardTitle as="h2">T</CardTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders the child with asChild', () => {
    render(
      <Card asChild>
        <article data-testid="a">x</article>
      </Card>,
    );
    const el = screen.getByTestId('a');
    expect(el.tagName).toBe('ARTICLE');
    expect(el).toHaveClass('ds-card');
    expect(el).toHaveAttribute('data-variant', 'outlined');
  });

  it('is focusable and followable as a link with asChild', async () => {
    const user = userEvent.setup();
    render(
      <Card asChild>
        <a href="#next">Link card</a>
      </Card>,
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'Link card' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(window.location.hash).toBe('#next');
  });

  it('merges className, forwards ref and props on every part', () => {
    const refs = {
      card: createRef<HTMLDivElement>(),
      header: createRef<HTMLDivElement>(),
      title: createRef<HTMLHeadingElement>(),
      description: createRef<HTMLParagraphElement>(),
      body: createRef<HTMLDivElement>(),
      footer: createRef<HTMLDivElement>(),
    };
    render(
      <Card ref={refs.card} className="x">
        <CardHeader ref={refs.header} className="x" id="h">
          <CardTitle ref={refs.title} className="x">
            T
          </CardTitle>
          <CardDescription ref={refs.description} className="x">
            D
          </CardDescription>
        </CardHeader>
        <CardBody ref={refs.body} className="x" />
        <CardFooter ref={refs.footer} className="x" />
      </Card>,
    );
    const classes = [
      ['card', 'ds-card'],
      ['header', 'ds-card-header'],
      ['title', 'ds-card-title'],
      ['description', 'ds-card-description'],
      ['body', 'ds-card-body'],
      ['footer', 'ds-card-footer'],
    ] as const;
    for (const [key, base] of classes) {
      const el = refs[key].current;
      expect(el).toBeInstanceOf(HTMLElement);
      expect(el).toHaveClass(base, 'x');
    }
    expect(refs.header.current).toHaveAttribute('id', 'h');
  });

  it('sets displayNames', () => {
    expect(Card.displayName).toBe('Card');
    expect(CardTitle.displayName).toBe('CardTitle');
    expect(CardFooter.displayName).toBe('CardFooter');
  });

  it('has no axe violations', async () => {
    const { container } = render(full);
    await expectNoA11yViolations(container);
  });
});
