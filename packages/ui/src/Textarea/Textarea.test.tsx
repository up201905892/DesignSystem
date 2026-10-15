import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field';
import { Textarea } from './Textarea';

function Controlled({ onChange }: { onChange: () => void }) {
  const [value, setValue] = useState('');
  return (
    <Textarea
      aria-label="Message"
      value={value}
      onChange={(event) => {
        onChange();
        setValue(event.target.value);
      }}
    />
  );
}

describe('Textarea', () => {
  it('renders a native textarea', () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('accepts text with line breaks', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Message" />);
    await user.type(screen.getByRole('textbox'), 'one{Enter}two');
    expect(screen.getByRole('textbox')).toHaveValue('one\ntwo');
  });

  it('calls onChange when controlled and keeps the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('textbox')).toHaveValue('abc');
  });

  it('warns nothing in the console in both modes', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const user = userEvent.setup();
    render(
      <>
        <Textarea aria-label="Uncontrolled" defaultValue="x" />
        <Controlled onChange={() => {}} />
      </>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'a');
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    error.mockRestore();
    warn.mockRestore();
  });

  it('supports defaultValue', () => {
    render(<Textarea aria-label="Message" defaultValue="Hello" />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  it('has 3 rows by default and accepts a custom number', () => {
    const { rerender } = render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
    rerender(<Textarea aria-label="Message" rows={6} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
  });

  it('sets data-resize, defaulting to vertical', () => {
    const { rerender } = render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-resize', 'vertical');
    rerender(<Textarea aria-label="Message" resize="none" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-resize', 'none');
    rerender(<Textarea aria-label="Message" resize="both" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-resize', 'both');
  });

  it('sets data-size, defaulting to md', () => {
    const { rerender } = render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'md');
    rerender(<Textarea aria-label="Message" size="sm" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'sm');
  });

  it('does not accept typing when disabled', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Message" disabled />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not change the value when readOnly', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Message" readOnly defaultValue="fixed" />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByRole('textbox')).toHaveValue('fixed');
  });

  it('forwards the ref to a textarea and applies className and displayName', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Message" ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toHaveClass('ds-textarea', 'custom');
    expect(Textarea.displayName).toBe('Textarea');
  });

  it('marks invalid without a Field', () => {
    render(<Textarea aria-label="Message" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveAttribute('data-invalid');
  });

  it('Tab focuses it, skips it when disabled, and Enter does not submit the form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Textarea aria-label="First" />
        <Textarea aria-label="Skipped" disabled />
        <Textarea aria-label="Last" />
      </form>,
    );
    await user.tab();
    expect(screen.getByLabelText('First')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('First')).toHaveValue('\n');
    await user.tab();
    expect(screen.getByLabelText('Last')).toHaveFocus();
  });

  describe('inside a Field', () => {
    it('is found by its label and gets the Field attributes', () => {
      render(
        <Field required>
          <FieldLabel>Message</FieldLabel>
          <Textarea />
          <FieldDescription>Be kind.</FieldDescription>
        </Field>,
      );
      const el = screen.getByLabelText(/Message/);
      expect(el).toBe(screen.getByRole('textbox'));
      expect(el).toHaveAttribute('aria-required', 'true');
      expect(el).toHaveAccessibleDescription('Be kind.');
    });

    it('is invalid and described by the error', () => {
      render(
        <Field invalid>
          <FieldLabel>Message</FieldLabel>
          <Textarea />
          <FieldError>Message is required.</FieldError>
        </Field>,
      );
      const el = screen.getByRole('textbox');
      expect(el).toHaveAttribute('aria-invalid', 'true');
      expect(el).toHaveAccessibleDescription('Message is required.');
      expect(el).toHaveAttribute('data-invalid');
    });

    it('is disabled by the Field', () => {
      render(
        <Field disabled>
          <FieldLabel>Message</FieldLabel>
          <Textarea />
        </Field>,
      );
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('gives priority to props passed directly', () => {
      render(
        <Field id="from-field" disabled invalid>
          <FieldLabel>Message</FieldLabel>
          <Textarea id="mine" disabled={false} invalid={false} aria-describedby="other" />
        </Field>,
      );
      const el = screen.getByRole('textbox');
      expect(el).toHaveAttribute('id', 'mine');
      expect(el).toBeEnabled();
      expect(el).toHaveAttribute('aria-describedby', 'other');
      expect(el).not.toHaveAttribute('aria-invalid', 'true');
    });

    it('clicking the label focuses the textarea', async () => {
      const user = userEvent.setup();
      render(
        <Field>
          <FieldLabel>Message</FieldLabel>
          <Textarea />
        </Field>,
      );
      await user.click(screen.getByText('Message'));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations with aria-label', async () => {
      const { container } = render(<Textarea aria-label="Message" />);
      await expectNoA11yViolations(container);
    });

    it('has no axe violations in a Field in every state', async () => {
      const { container } = render(
        <>
          <Field required>
            <FieldLabel>Normal</FieldLabel>
            <Textarea />
            <FieldDescription>Help.</FieldDescription>
          </Field>
          <Field invalid>
            <FieldLabel>Invalid</FieldLabel>
            <Textarea />
            <FieldError>Oops.</FieldError>
          </Field>
          <Field disabled>
            <FieldLabel>Disabled</FieldLabel>
            <Textarea />
          </Field>
        </>,
      );
      await expectNoA11yViolations(container);
    });
  });
});
