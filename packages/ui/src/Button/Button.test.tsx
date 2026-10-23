import { createRef, type FormEvent, type MouseEvent } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from './Button';

const Icon = () => <svg data-testid="icon" width="16" height="16" />;

describe('Button', () => {
  it('renders its text and defaults', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('ds-button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
  });

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)('variant %s', (variant) => {
    render(<Button variant={variant}>x</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
  });

  it.each(['sm', 'md', 'lg'] as const)('size %s', (size) => {
    render(<Button size={size}>x</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });

  it('adds className to the base class', () => {
    render(<Button className="extra">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('ds-button', 'extra');
  });

  it('forwards the ref to the button and has a displayName', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>x</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(Button.displayName).toBe('Button');
  });

  it('sets data-full-width', () => {
    render(<Button fullWidth>x</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-full-width');
  });

  it('calls onClick once per click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>x</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('submits a form with type="submit"', () => {
    const onSubmit = vi.fn((e: FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Send</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not submit a form by default', () => {
    const onSubmit = vi.fn((e: FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Send</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  describe('asChild', () => {
    it('renders a link with the class and no type', () => {
      const ref = createRef<HTMLButtonElement>();
      const { container } = render(
        <Button asChild variant="secondary" size="lg" ref={ref}>
          <a href="/x">Docs</a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Docs' });
      expect(link).toHaveClass('ds-button');
      expect(link).not.toHaveAttribute('type');
      expect(link).toHaveAttribute('data-variant', 'secondary');
      expect(link).toHaveAttribute('data-size', 'lg');
      expect(container.querySelector('button')).toBeNull();
      expect(ref.current).toBe(link);
    });

    it('still calls onClick when enabled', () => {
      const onClick = vi.fn((e: MouseEvent) => e.preventDefault());
      render(
        <Button asChild onClick={onClick}>
          <a href="/x">Docs</a>
        </Button>,
      );
      fireEvent.click(screen.getByRole('link'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled', () => {
    it('uses the native attribute without asChild', async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          x
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-disabled');
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('with asChild sets aria-disabled and blocks clicks', () => {
      const onClick = vi.fn();
      const childClick = vi.fn();
      render(
        <Button asChild disabled onClick={onClick}>
          <a href="/x" onClick={childClick}>
            Docs
          </a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Docs' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-disabled');
      expect(link).toHaveAttribute('tabindex', '-1');
      expect(link).not.toHaveAttribute('disabled');
      const notCancelled = fireEvent.click(link);
      expect(notCancelled).toBe(false);
      expect(onClick).not.toHaveBeenCalled();
      expect(childClick).not.toHaveBeenCalled();
    });
  });

  describe('icons', () => {
    it('wraps icons in aria-hidden spans without changing the name', () => {
      render(
        <Button leadingIcon={<Icon />} trailingIcon={<Icon />}>
          Next
        </Button>,
      );
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      for (const icon of screen.getAllByTestId('icon')) {
        expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
      }
    });

    it('with asChild renders icons inside the child, around the text', () => {
      const { container } = render(
        <Button asChild leadingIcon={<Icon />} trailingIcon={<Icon />}>
          <a href="/x">Docs</a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Docs' });
      expect(container.firstElementChild).toBe(link);
      const nodes = Array.from(link.childNodes);
      expect(nodes).toHaveLength(3);
      expect((nodes[0] as HTMLElement).getAttribute('aria-hidden')).toBe('true');
      expect(nodes[1]?.textContent).toBe('Docs');
      expect((nodes[2] as HTMLElement).getAttribute('aria-hidden')).toBe('true');
    });

    it('with asChild puts only the leading icon before the text', () => {
      render(
        <Button asChild leadingIcon={<Icon />}>
          <a href="/x">Docs</a>
        </Button>,
      );
      const nodes = Array.from(screen.getByRole('link').childNodes);
      expect(nodes).toHaveLength(2);
      expect((nodes[0] as HTMLElement).getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <Button leadingIcon={<Icon />}>Save</Button>
          <Button disabled>Off</Button>
          <Button asChild leadingIcon={<Icon />} trailingIcon={<Icon />}>
            <a href="/x">Docs</a>
          </Button>
          <Button asChild disabled>
            <a href="/y">Disabled docs</a>
          </Button>
        </div>,
      );
      await expectNoA11yViolations(container);
    });

    it('is focusable and activates with Enter and Space', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>x</Button>);
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('is skipped by Tab when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <>
          <button type="button">before</button>
          <Button disabled onClick={onClick}>
            x
          </Button>
          <button type="button">after</button>
        </>,
      );
      await user.tab();
      expect(screen.getByRole('button', { name: 'before' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
      await user.keyboard('{Enter} ');
      expect(onClick).not.toHaveBeenCalled();
    });

    it('blocks Enter and clicks on the icon of a focused disabled asChild link', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button asChild disabled leadingIcon={<Icon />} onClick={onClick}>
          <a href="/x">Docs</a>
        </Button>,
      );
      screen.getByRole('link', { name: 'Docs' }).focus();
      await user.keyboard('{Enter}');
      await user.click(screen.getByTestId('icon'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('skips a disabled asChild link with Tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button type="button">before</button>
          <Button asChild disabled>
            <a href="/x">Docs</a>
          </Button>
          <button type="button">after</button>
        </>,
      );
      await user.tab();
      expect(screen.getByRole('button', { name: 'before' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
    });
  });

  describe('loading', () => {
    it('replaces the leading icon with a Spinner and sets the busy state', () => {
      render(
        <Button loading leadingIcon={<Icon />} trailingIcon={<span data-testid="trail" />}>
          Save
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-loading');
      expect(button).not.toHaveAttribute('disabled');
      expect(button).not.toHaveAttribute('tabindex', '-1');
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
      expect(screen.getByTestId('trail')).toBeInTheDocument();
      const wrapper = button.querySelector('.ds-spinner')?.parentElement;
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      expect(wrapper).toBe(button.firstElementChild);
    });

    it('creates the icon span when there is no leadingIcon', () => {
      render(<Button loading>Save</Button>);
      const button = screen.getByRole('button');
      expect(button.firstElementChild).toHaveAttribute('aria-hidden', 'true');
      expect(button.firstElementChild?.querySelector('.ds-spinner')).not.toBeNull();
    });

    it('has no busy state or Spinner without loading', () => {
      render(<Button leadingIcon={<Icon />}>Save</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-busy');
      expect(button).not.toHaveAttribute('aria-disabled');
      expect(button).not.toHaveAttribute('data-loading');
      expect(button).not.toHaveAttribute('aria-describedby');
      expect(button.querySelector('.ds-spinner')).toBeNull();
    });

    it('keeps the name and describes the button with the loadingLabel', () => {
      const { rerender } = render(<Button loading>Save</Button>);
      expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription('Loading');
      rerender(
        <Button loading loadingLabel="Saving changes">
          Save
        </Button>,
      );
      expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription(
        'Saving changes',
      );
    });

    it('adds to an existing aria-describedby', () => {
      render(
        <>
          <p id="hint">Hint</p>
          <Button loading aria-describedby="hint">
            Save
          </Button>
        </>,
      );
      expect(screen.getByRole('button')).toHaveAccessibleDescription('Hint Loading');
    });

    it('blocks clicks and cancels the event', () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      expect(fireEvent.click(screen.getByRole('button'))).toBe(false);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not submit a form', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit" loading>
            Save
          </Button>
        </form>,
      );
      await user.click(screen.getByRole('button'));
      await user.tab();
      await user.keyboard('{Enter} ');
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('with disabled, disabled prevails and the Spinner stays', () => {
      render(
        <Button loading disabled>
          Save
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.querySelector('.ds-spinner')).not.toBeNull();
    });

    it('stays in the Tab order, unlike disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { rerender } = render(
        <>
          <Button loading onClick={onClick}>
            x
          </Button>
          <button type="button">after</button>
        </>,
      );
      await user.tab();
      expect(screen.getByRole('button', { name: 'x' })).toHaveFocus();
      await user.keyboard('{Enter} ');
      expect(onClick).not.toHaveBeenCalled();
      rerender(
        <>
          <Button disabled onClick={onClick}>
            x
          </Button>
          <button type="button">after</button>
        </>,
      );
      screen.getByRole('button', { name: 'x' }).blur();
      await user.tab();
      expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
    });

    it('keeps focus on the button when loading toggles', () => {
      const { rerender } = render(<Button>Save</Button>);
      const button = screen.getByRole('button');
      button.focus();
      rerender(<Button loading>Save</Button>);
      expect(button).toHaveFocus();
    });

    describe('asChild', () => {
      it('marks the link, blocks clicks and puts the Spinner before the text', async () => {
        const user = userEvent.setup();
        const outer = vi.fn();
        const inner = vi.fn();
        render(
          <Button asChild loading onClick={outer}>
            <a href="/x" onClick={inner}>
              Save
            </a>
          </Button>,
        );
        const link = screen.getByRole('link', { name: 'Save' });
        expect(link).toHaveAttribute('aria-disabled', 'true');
        expect(link).toHaveAttribute('aria-busy', 'true');
        expect(link).toHaveAttribute('data-loading');
        expect(link).not.toHaveAttribute('tabindex', '-1');
        expect(link).toHaveAccessibleDescription('Loading');
        const spinner = link.querySelector('.ds-spinner');
        expect(spinner).not.toBeNull();
        expect(link.firstElementChild).toContainElement(spinner as HTMLElement);
        expect(link.childNodes).toHaveLength(2);
        expect(fireEvent.click(link)).toBe(false);
        link.focus();
        await user.keyboard('{Enter}');
        expect(outer).not.toHaveBeenCalled();
        expect(inner).not.toHaveBeenCalled();
      });

      it('is focusable with Tab', async () => {
        const user = userEvent.setup();
        render(
          <Button asChild loading>
            <a href="/x">Save</a>
          </Button>,
        );
        await user.tab();
        expect(screen.getByRole('link')).toHaveFocus();
      });
    });

    it('has no axe violations', async () => {
      const { container } = render(
        <div>
          <Button loading>Save</Button>
          <Button loading leadingIcon={<Icon />} variant="danger">
            Delete
          </Button>
          <Button asChild loading>
            <a href="/x">Open</a>
          </Button>
        </div>,
      );
      await expectNoA11yViolations(container);
    });
  });
});
