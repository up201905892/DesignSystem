import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Field, FieldDescription, FieldError, FieldLabel, useFieldControl } from './Field';

function Control() {
  return <input {...useFieldControl()} />;
}

function Example(props: {
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  description?: boolean;
}) {
  const { description = true, ...field } = props;
  return (
    <Field {...field}>
      <FieldLabel>Name</FieldLabel>
      <Control />
      {description ? <FieldDescription>As on your ID.</FieldDescription> : null}
      <FieldError>Name is required.</FieldError>
    </Field>
  );
}

describe('Field', () => {
  it('links the label to the control', () => {
    render(<Example />);
    expect(screen.getByLabelText('Name')).toBe(screen.getByRole('textbox'));
  });

  it('uses the given id', () => {
    render(<Example id="custom" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom');
  });

  it('describes the control with the description only when valid', () => {
    render(<Example />);
    const input = screen.getByRole('textbox');
    const description = screen.getByText('As on your ID.');
    expect(input.getAttribute('aria-describedby')).toBe(description.id);
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription('As on your ID.');
  });

  it('adds the error to aria-describedby when invalid', () => {
    render(<Example invalid />);
    const input = screen.getByRole('textbox');
    const description = screen.getByText('As on your ID.');
    const error = screen.getByText('Name is required.');
    expect(input.getAttribute('aria-describedby')).toBe(`${description.id} ${error.id}`);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('As on your ID. Name is required.');
  });

  it('works with an error and no description', () => {
    render(<Example invalid description={false} />);
    const error = screen.getByText('Name is required.');
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBe(error.id);
  });

  it('has no aria-describedby without description or error', () => {
    render(<Example description={false} />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('passes required with an aria-hidden indicator on the label', () => {
    render(<Example required />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    const label = screen.getByText('Name').closest('label');
    expect(label?.querySelector('[aria-hidden="true"]')).toHaveTextContent('*');
  });

  it('passes disabled to the control and sets data attributes on the root', () => {
    const { container } = render(<Example disabled invalid />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(container.firstElementChild).toHaveAttribute('data-disabled');
    expect(container.firstElementChild).toHaveAttribute('data-invalid');
  });

  it('gives different ids to two fields', () => {
    render(
      <>
        <Example />
        <Example />
      </>,
    );
    const [a, b] = screen.getAllByRole('textbox');
    expect(a?.id).toBeTruthy();
    expect(a?.id).not.toBe(b?.id);
  });

  it('focuses the control when the label is clicked', async () => {
    render(<Example />);
    await userEvent.click(screen.getByText('Name'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('forwards refs, merges className and passes native props', () => {
    const ref = createRef<HTMLDivElement>();
    const labelRef = createRef<HTMLLabelElement>();
    render(
      <Field ref={ref} className="extra" data-testid="field">
        <FieldLabel ref={labelRef} className="mine">
          Name
        </FieldLabel>
      </Field>,
    );
    expect(ref.current).toBe(screen.getByTestId('field'));
    expect(ref.current).toHaveClass('ds-field', 'extra');
    expect(labelRef.current).toHaveClass('ds-field__label', 'mine');
  });

  it('keeps a control working outside a Field', () => {
    render(<Control />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('id');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toBeEnabled();
  });

  it('renders parts outside a Field without crashing', () => {
    render(
      <>
        <FieldLabel>Alone</FieldLabel>
        <FieldDescription>Help</FieldDescription>
        <FieldError>Error</FieldError>
      </>,
    );
    expect(screen.getByText('Alone')).toBeInTheDocument();
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('updates aria-describedby when invalid toggles and when the description is removed', () => {
    const { rerender } = render(<Example />);
    const input = screen.getByRole('textbox');
    const descriptionId = screen.getByText('As on your ID.').id;
    expect(input.getAttribute('aria-describedby')).toBe(descriptionId);

    rerender(<Example invalid />);
    const errorId = screen.getByText('Name is required.').id;
    expect(input.getAttribute('aria-describedby')).toBe(`${descriptionId} ${errorId}`);

    rerender(<Example />);
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();
    expect(input.getAttribute('aria-describedby')).toBe(descriptionId);

    rerender(<Example invalid description={false} />);
    expect(input.getAttribute('aria-describedby')).toBe(errorId);
  });

  it('has displayNames', () => {
    expect(Field.displayName).toBe('Field');
    expect(FieldLabel.displayName).toBe('FieldLabel');
    expect(FieldDescription.displayName).toBe('FieldDescription');
    expect(FieldError.displayName).toBe('FieldError');
  });

  it.each([{}, { invalid: true }, { disabled: true }, { required: true }])(
    'has no axe violations with %j',
    async (state) => {
      const { container } = render(<Example {...state} />);
      await expectNoA11yViolations(container);
    },
  );
});
