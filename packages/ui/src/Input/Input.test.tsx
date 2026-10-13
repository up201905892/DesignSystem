import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field';
import { Input } from './Input';

function Controlled({ onChange }: { onChange: () => void }) {
  const [value, setValue] = useState('');
  return (
    <Input
      aria-label="Name"
      value={value}
      onChange={(event) => {
        onChange();
        setValue(event.target.value);
      }}
    />
  );
}

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it.each(['email', 'password', 'search', 'number', 'tel', 'url'] as const)(
    'accepts type %s',
    (type) => {
      render(<Input aria-label="Value" type={type} />);
      expect(screen.getByLabelText('Value')).toHaveAttribute('type', type);
    },
  );

  it('types into an uncontrolled input', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByRole('textbox')).toHaveValue('abc');
  });

  it('calls onChange three times when controlled', async () => {
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
        <Input aria-label="Uncontrolled" defaultValue="x" />
        <Controlled onChange={() => {}} />
      </>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'a');
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    error.mockRestore();
    warn.mockRestore();
  });

  it('supports defaultValue', () => {
    render(<Input aria-label="Name" defaultValue="Ada" />);
    expect(screen.getByRole('textbox')).toHaveValue('Ada');
  });

  it('does not accept typing when disabled', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" disabled />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not change the value when readOnly', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" readOnly defaultValue="fixed" />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByRole('textbox')).toHaveValue('fixed');
  });

  it('sets data-size, defaulting to md', () => {
    const { rerender } = render(<Input aria-label="Name" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'md');
    rerender(<Input aria-label="Name" size="lg" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'lg');
    expect(screen.getByRole('textbox').parentElement).toHaveAttribute('data-size', 'lg');
  });

  it('forwards the ref to the input and applies className', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Name" ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveClass('ds-input__control', 'custom');
  });

  it('has a displayName and passes native props', () => {
    expect(Input.displayName).toBe('Input');
    render(<Input aria-label="Name" placeholder="Your name" name="name" maxLength={5} />);
    expect(screen.getByPlaceholderText('Your name')).toHaveAttribute('name', 'name');
  });

  it('marks invalid without a Field', () => {
    render(<Input aria-label="Name" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox').parentElement).toHaveAttribute('data-invalid');
  });

  it('renders addons as aria-hidden and focuses the input when pressed', async () => {
    const user = userEvent.setup();
    render(
      <Input
        aria-label="Search"
        leadingAddon={<span data-testid="lead">L</span>}
        trailingAddon={<span data-testid="trail">T</span>}
      />,
    );
    expect(screen.getByTestId('lead').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('trail').parentElement).toHaveAttribute('aria-hidden', 'true');
    await user.click(screen.getByTestId('lead'));
    expect(screen.getByRole('textbox')).toHaveFocus();
    screen.getByRole('textbox').blur();
    await user.click(screen.getByTestId('trail'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Tab focuses the input and skips it when disabled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Input aria-label="First" />
        <Input aria-label="Skipped" disabled />
        <Input aria-label="Last" />
      </>,
    );
    await user.tab();
    expect(screen.getByLabelText('First')).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText('Skipped')).not.toHaveFocus();
    expect(screen.getByLabelText('Last')).toHaveFocus();
  });

  describe('inside a Field', () => {
    it('is found by its label and gets the Field attributes', () => {
      render(
        <Field required>
          <FieldLabel>Name</FieldLabel>
          <Input />
          <FieldDescription>As on your ID.</FieldDescription>
        </Field>,
      );
      const input = screen.getByLabelText(/Name/);
      expect(input).toBe(screen.getByRole('textbox'));
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAccessibleDescription('As on your ID.');
    });

    it('is invalid and described by the error', () => {
      render(
        <Field invalid>
          <FieldLabel>Name</FieldLabel>
          <Input />
          <FieldError>Name is required.</FieldError>
        </Field>,
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-error'));
      expect(input).toHaveAccessibleDescription('Name is required.');
      expect(input.parentElement).toHaveAttribute('data-invalid');
    });

    it('is disabled by the Field', () => {
      render(
        <Field disabled>
          <FieldLabel>Name</FieldLabel>
          <Input />
        </Field>,
      );
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('gives priority to props passed directly', () => {
      render(
        <Field id="from-field" disabled>
          <FieldLabel>Name</FieldLabel>
          <Input id="mine" disabled={false} aria-describedby="other" />
        </Field>,
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'mine');
      expect(input).toBeEnabled();
      expect(input).toHaveAttribute('aria-describedby', 'other');
    });

    it('lets invalid={false} override an invalid Field', () => {
      render(
        <Field invalid>
          <FieldLabel>Name</FieldLabel>
          <Input invalid={false} />
        </Field>,
      );
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-invalid', 'true');
      expect(input.parentElement).not.toHaveAttribute('data-invalid');
    });

    it('keeps an explicit aria-invalid="false" inside an invalid Field and a direct aria-required', () => {
      render(
        <Field invalid required>
          <FieldLabel>Name</FieldLabel>
          <Input aria-invalid="false" aria-required={false} />
        </Field>,
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(input).toHaveAttribute('aria-required', 'false');
    });

    it('clicking the label focuses the input', async () => {
      const user = userEvent.setup();
      render(
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input />
        </Field>,
      );
      await user.click(screen.getByText('Name'));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations with aria-label', async () => {
      const { container } = render(<Input aria-label="Name" />);
      await expectNoA11yViolations(container);
    });

    it('has no axe violations in a Field in every state', async () => {
      const { container } = render(
        <>
          <Field required>
            <FieldLabel>Normal</FieldLabel>
            <Input leadingAddon={<span>@</span>} />
            <FieldDescription>Help.</FieldDescription>
          </Field>
          <Field invalid>
            <FieldLabel>Invalid</FieldLabel>
            <Input />
            <FieldError>Oops.</FieldError>
          </Field>
          <Field disabled>
            <FieldLabel>Disabled</FieldLabel>
            <Input />
          </Field>
        </>,
      );
      await expectNoA11yViolations(container);
    });
  });
});
