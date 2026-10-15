import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { useFieldControl } from '../Field';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Size of the field; sets its minimum height (32px, 40px or 48px) and the font size. */
  size?: 'sm' | 'md' | 'lg';
  /** Marks the textarea as invalid (`aria-invalid` and the danger border). */
  invalid?: boolean;
  /** Which way the user may resize the field (`data-resize`). Defaults to `vertical`. */
  resize?: 'none' | 'vertical' | 'both';
}

/**
 * A multi-line text field with the same look as `Input`. `ref`, `className` and the native
 * props go to the `<textarea>`. The size is a minimum height; the real height comes from `rows`.
 *
 * @example
 * <Field>
 *   <FieldLabel>Message</FieldLabel>
 *   <Textarea rows={5} />
 * </Field>
 *
 * Accessibility: inside a `Field` it gets `id`, `aria-describedby`, `aria-invalid`,
 * `aria-required` and `disabled` automatically (props passed directly win). Outside a `Field`
 * give it an accessible name with `aria-label` or a `<label>`. Enter inserts a new line.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    invalid,
    resize = 'vertical',
    rows = 3,
    className,
    id,
    disabled,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...props
  },
  ref,
) {
  const field = useFieldControl();

  const isDisabled = disabled ?? field.disabled ?? false;
  const invalidOn =
    invalid ??
    (ariaInvalid !== undefined
      ? ariaInvalid === true || ariaInvalid === 'true'
      : !!field['aria-invalid']);
  const ariaInvalidValue = invalidOn
    ? true
    : ariaInvalid === false || ariaInvalid === 'false'
      ? false
      : undefined;

  return (
    <textarea
      ref={ref}
      id={id ?? field.id}
      rows={rows}
      disabled={isDisabled}
      aria-describedby={ariaDescribedBy ?? field['aria-describedby']}
      aria-invalid={ariaInvalidValue}
      aria-required={ariaRequired ?? field['aria-required']}
      className={cx('ds-textarea', className)}
      data-size={size}
      data-resize={resize}
      data-invalid={invalidOn ? '' : undefined}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
