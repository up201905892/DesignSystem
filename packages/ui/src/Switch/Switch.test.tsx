import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Field, FieldDescription } from '../Field';
import { Switch } from './Switch';

function Controlled({ onChange }: { onChange: (value: boolean) => void }) {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      checked={checked}
      onCheckedChange={(value) => {
        onChange(value);
        setChecked(value);
      }}
    >
      Notifications
    </Switch>
  );
}

describe('Switch', () => {
  it('has role switch and an accessible name from children', () => {
    render(<Switch>Notifications</Switch>);
    const el = screen.getByRole('switch', { name: 'Notifications' });
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveAttribute('aria-checked', 'false');
    expect(el).toHaveAttribute('data-state', 'unchecked');
  });

  it('toggles aria-checked and calls onCheckedChange with the new value', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange}>Notifications</Switch>);
    const el = screen.getByRole('switch');
    await user.click(el);
    expect(el).toHaveAttribute('aria-checked', 'true');
    expect(el).toHaveAttribute('data-state', 'checked');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await user.click(el);
    expect(el).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('respects defaultChecked', () => {
    render(<Switch defaultChecked>Notifications</Switch>);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('only changes in controlled mode when the prop changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Switch checked={false} onCheckedChange={onCheckedChange}>
        Notifications
      </Switch>,
    );
    const el = screen.getByRole('switch');
    await user.click(el);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(el).toHaveAttribute('aria-checked', 'false');
    rerender(
      <Switch checked onCheckedChange={onCheckedChange}>
        Notifications
      </Switch>,
    );
    expect(el).toHaveAttribute('aria-checked', 'true');
  });

  it('works with a stateful parent', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<Switch>Notifications</Switch>);
    await user.click(screen.getByText('Notifications'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch disabled onCheckedChange={onCheckedChange}>
        Notifications
      </Switch>,
    );
    await user.click(screen.getByText('Notifications'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('includes the value in FormData when on and omits it when off or disabled', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Switch name="notify" value="yes">
          A
        </Switch>
        <Switch name="other" disabled defaultChecked>
          B
        </Switch>
      </form>,
    );
    const form = screen.getByTestId<HTMLFormElement>('form');
    expect(new FormData(form).get('notify')).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'A' }));
    expect(new FormData(form).get('notify')).toBe('yes');
    await user.click(screen.getByRole('switch', { name: 'A' }));
    expect(new FormData(form).get('notify')).toBeNull();
    expect(new FormData(form).get('other')).toBeNull();
  });

  it('is focused by Tab and toggled by Space and Enter', async () => {
    const user = userEvent.setup();
    render(<Switch>Notifications</Switch>);
    const el = screen.getByRole('switch', { name: 'Notifications' });
    await user.tab();
    expect(el).toHaveFocus();
    await user.keyboard(' ');
    expect(el).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{Enter}');
    expect(el).toHaveAttribute('aria-checked', 'false');
  });

  it('is skipped by Tab when disabled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Switch disabled>Off</Switch>
        <button type="button">After</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('sets data-size and forwards ref, className and displayName', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} size="sm" className="extra" aria-label="Solo" />);
    const el = screen.getByRole('switch', { name: 'Solo' });
    expect(ref.current).toBe(el);
    expect(el).toHaveClass('ds-switch__control', 'extra');
    expect(el).toHaveAttribute('data-size', 'sm');
    expect(Switch.displayName).toBe('Switch');
  });

  describe('inside a Field', () => {
    it('links id, description and required', () => {
      render(
        <Field id="notify" required>
          <Switch>Notifications</Switch>
          <FieldDescription>Applies immediately.</FieldDescription>
        </Field>,
      );
      const el = screen.getByRole('switch');
      expect(el).toHaveAttribute('id', 'notify');
      expect(el).toHaveAttribute('aria-describedby', 'notify-description');
      expect(el).toHaveAttribute('aria-required', 'true');
    });

    it('is disabled by the Field and direct props win', () => {
      render(
        <Field disabled>
          <Switch aria-label="A" />
          <Switch aria-label="B" disabled={false} />
        </Field>,
      );
      expect(screen.getByRole('switch', { name: 'A' })).toBeDisabled();
      expect(screen.getByRole('switch', { name: 'B' })).not.toBeDisabled();
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Switch>Off</Switch>
        <Switch defaultChecked>On</Switch>
        <Switch disabled>Disabled</Switch>
        <Switch disabled defaultChecked size="sm">
          Disabled on
        </Switch>
        <Field>
          <Switch>In field</Switch>
          <FieldDescription>Applies immediately.</FieldDescription>
        </Field>
      </>,
    );
    await expectNoA11yViolations(container);
  });
});
