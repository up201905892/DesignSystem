import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button loading (QA DS-021)', () => {
  it('asChild + loading keeps the trailingIcon and the Spinner replaces only the leading icon', () => {
    render(
      <Button
        asChild
        loading
        leadingIcon={<svg data-testid="lead" />}
        trailingIcon={<svg data-testid="trail" />}
      >
        <a href="/x">Save</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Save' });
    expect(screen.queryByTestId('lead')).not.toBeInTheDocument();
    expect(screen.getByTestId('trail')).toBeInTheDocument();
    expect(link.querySelectorAll('.ds-spinner')).toHaveLength(1);
  });

  it('asChild + loading + disabled: disabled prevails, Spinner stays, click blocked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button asChild loading disabled onClick={onClick}>
          <a href="/x">Save</a>
        </Button>
        <button type="button">after</button>
      </>,
    );
    const link = screen.getByRole('link', { name: 'Save' });
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link.querySelector('.ds-spinner')).not.toBeNull();
    expect(fireEvent.click(link)).toBe(false);
    await user.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('asChild + loading keeps a consumer aria-describedby passed to the Button', () => {
    render(
      <>
        <p id="hint">Hint</p>
        <Button asChild loading aria-describedby="hint">
          <a href="/x">Save</a>
        </Button>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Save' })).toHaveAccessibleDescription('Hint Loading');
  });

  it('asChild + loading keeps an aria-describedby set on the child itself', () => {
    render(
      <>
        <p id="hint">Hint</p>
        <Button asChild loading>
          <a href="/x" aria-describedby="hint">
            Save
          </a>
        </Button>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Save' })).toHaveAccessibleDescription('Hint Loading');
  });

  it('loading ends: attributes and description are removed', () => {
    const { rerender } = render(<Button loading>Save</Button>);
    rerender(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    for (const attr of ['aria-busy', 'aria-disabled', 'data-loading', 'aria-describedby']) {
      expect(button).not.toHaveAttribute(attr);
    }
    expect(button.querySelector('.ds-spinner')).toBeNull();
  });

  it('forwards a consumer onClickCapture only when not loading', () => {
    const capture = vi.fn();
    const { rerender } = render(<Button onClickCapture={capture}>Save</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(capture).toHaveBeenCalledTimes(1);
    rerender(
      <Button loading onClickCapture={capture}>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(capture).toHaveBeenCalledTimes(1);
  });
});
