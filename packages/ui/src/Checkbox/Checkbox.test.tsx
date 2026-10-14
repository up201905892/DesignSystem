import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Field, FieldDescription, FieldError } from '../Field';
import { Checkbox } from './Checkbox';

function Controlled({ onChange }: { onChange: (value: unknown) => void }) {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => {
        onChange(value);
        setChecked(value === true);
      }}
    >
      I accept the terms
    </Checkbox>
  );
}

describe('Checkbox', () => {
  it('has role checkbox and an accessible name from children', () => {
    render(<Checkbox>I accept the terms</Checkbox>);
    expect(screen.getByRole('checkbox', { name: 'I accept the terms' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('toggles aria-checked when uncontrolled', async () => {
    const user = userEvent.setup();
    render(<Checkbox>Accept</Checkbox>);
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(box).toHaveAttribute('aria-checked', 'true');
    expect(box).toHaveAttribute('data-state', 'checked');
    await user.click(box);
    expect(box).toHaveAttribute('aria-checked', 'false');
  });

  it('respects defaultChecked', () => {
    render(<Checkbox defaultChecked>Accept</Checkbox>);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('only changes in controlled mode when the prop changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange}>
        Accept
      </Checkbox>,
    );
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toHaveAttribute('aria-checked', 'false');
    rerender(
      <Checkbox checked onCheckedChange={onCheckedChange}>
        Accept
      </Checkbox>,
    );
    expect(box).toHaveAttribute('aria-checked', 'true');
  });

  it('works with a stateful parent', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('exposes the indeterminate state as mixed', () => {
    render(<Checkbox checked="indeterminate">Some</Checkbox>);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    expect(box).toHaveAttribute('data-state', 'indeterminate');
  });

  it('toggles when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<Checkbox>I accept the terms</Checkbox>);
    await user.click(screen.getByText('I accept the terms'));
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange}>
        Accept
      </Checkbox>,
    );
    await user.click(screen.getByText('Accept'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('includes the value in FormData when checked', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Checkbox name="terms" value="yes">
          Accept
        </Checkbox>
      </form>,
    );
    const form = screen.getByTestId<HTMLFormElement>('form');
    expect(new FormData(form).get('terms')).toBeNull();
    await user.click(screen.getByRole('checkbox'));
    expect(new FormData(form).get('terms')).toBe('yes');
  });

  it('is focused by Tab, toggled by Space and not by Enter', async () => {
    const user = userEvent.setup();
    render(<Checkbox>Accept</Checkbox>);
    const box = screen.getByRole('checkbox');
    await user.tab();
    expect(box).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(box).toHaveAttribute('aria-checked', 'false');
    await user.keyboard(' ');
    expect(box).toHaveAttribute('aria-checked', 'true');
  });

  it('is skipped by Tab when disabled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox disabled>Off</Checkbox>
        <button type="button">After</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('sets data-size and forwards ref, className and displayName', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} size="sm" className="extra" aria-label="Solo" />);
    const box = screen.getByRole('checkbox', { name: 'Solo' });
    expect(ref.current).toBe(box);
    expect(box).toHaveClass('ds-checkbox__control', 'extra');
    expect(box).toHaveAttribute('data-size', 'sm');
    expect(Checkbox.displayName).toBe('Checkbox');
  });

  it('renders the matching icon for checked and indeterminate', () => {
    const { container, rerender } = render(<Checkbox checked>Accept</Checkbox>);
    expect(container.querySelector('.ds-checkbox__indicator')).toHaveAttribute(
      'data-state',
      'checked',
    );
    rerender(<Checkbox checked="indeterminate">Accept</Checkbox>);
    expect(container.querySelector('.ds-checkbox__indicator')).toHaveAttribute(
      'data-state',
      'indeterminate',
    );
  });

  describe('inside a Field', () => {
    it('links id, description, error and invalid', () => {
      render(
        <Field id="terms" invalid required>
          <Checkbox>Accept</Checkbox>
          <FieldDescription>Read first.</FieldDescription>
          <FieldError>Required.</FieldError>
        </Field>,
      );
      const box = screen.getByRole('checkbox');
      expect(box).toHaveAttribute('id', 'terms');
      expect(box).toHaveAttribute('aria-describedby', 'terms-description terms-error');
      expect(box).toHaveAttribute('aria-invalid', 'true');
      expect(box).toHaveAttribute('aria-required', 'true');
    });

    it('is disabled by the Field', () => {
      render(
        <Field disabled>
          <Checkbox>Accept</Checkbox>
        </Field>,
      );
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('lets direct props win', () => {
      render(
        <Field disabled invalid>
          <Checkbox disabled={false} invalid={false}>
            Accept
          </Checkbox>
        </Field>,
      );
      const box = screen.getByRole('checkbox');
      expect(box).not.toBeDisabled();
      expect(box).not.toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('asks for true when an indeterminate checkbox is activated', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox checked="indeterminate" onCheckedChange={onCheckedChange}>
        Select all
      </Checkbox>,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select all' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('removes the value from FormData when unchecked again and omits it when disabled', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Checkbox name="a" value="yes">
          A
        </Checkbox>
        <Checkbox name="b" value="yes" disabled defaultChecked>
          B
        </Checkbox>
      </form>,
    );
    const form = screen.getByTestId<HTMLFormElement>('form');
    await user.click(screen.getByRole('checkbox', { name: 'A' }));
    expect(new FormData(form).get('a')).toBe('yes');
    await user.click(screen.getByRole('checkbox', { name: 'A' }));
    expect(new FormData(form).get('a')).toBeNull();
    expect(new FormData(form).get('b')).toBeNull();
  });

  it('toggles with Space in controlled mode and keeps the label click working in a Field', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Field>
        <Controlled onChange={onChange} />
      </Field>,
    );
    await user.tab();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(true);
    await user.click(screen.getByText('I accept the terms'));
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox defaultChecked>Checked</Checkbox>
        <Checkbox checked="indeterminate">Mixed</Checkbox>
        <Checkbox disabled>Disabled</Checkbox>
        <Field invalid>
          <Checkbox>Invalid</Checkbox>
          <FieldError>Required.</FieldError>
        </Field>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
