import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useFieldControl } from '../Field';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size of the field; sets its minimum height (32px, 40px or 48px). */
  size?: 'sm' | 'md' | 'lg';
  /** Marks the input as invalid (`aria-invalid` and the danger border). */
  invalid?: boolean;
  /** Decorative content before the text (for example a search icon); `aria-hidden`. */
  leadingAddon?: ReactNode;
  /** Decorative content after the text; `aria-hidden`. */
  trailingAddon?: ReactNode;
}

/**
 * A single-line text field. `ref`, `className` and the native props go to the `<input>`;
 * the outline, hover, focus and addons are drawn by a wrapper around it.
 *
 * @example
 * <Field required>
 *   <FieldLabel>Email</FieldLabel>
 *   <Input type="email" leadingAddon={<MailIcon />} />
 * </Field>
 *
 * Accessibility: inside a `Field` it gets `id`, `aria-describedby`, `aria-invalid`,
 * `aria-required` and `disabled` automatically (props passed directly win). Outside a `Field`
 * give it an accessible name with `aria-label` or a `<label>`. Addons are decorative and
 * clicking them focuses the input.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    invalid,
    leadingAddon,
    trailingAddon,
    className,
    type = 'text',
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
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

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

  function focusFromAddon(event: MouseEvent<HTMLDivElement>) {
    if (event.target === inputRef.current) return;
    event.preventDefault();
    inputRef.current?.focus();
  }

  return (
    // The wrapper only forwards pointer presses on the addons to the input; the input stays the
    // single keyboard and assistive technology target.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="ds-input"
      data-size={size}
      data-invalid={invalidOn ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      onMouseDown={focusFromAddon}
    >
      {leadingAddon ? (
        <span className="ds-input__addon" aria-hidden="true">
          {leadingAddon}
        </span>
      ) : null}
      <input
        ref={inputRef}
        type={type}
        id={id ?? field.id}
        disabled={isDisabled}
        aria-describedby={ariaDescribedBy ?? field['aria-describedby']}
        aria-invalid={ariaInvalidValue}
        aria-required={ariaRequired ?? field['aria-required']}
        className={cx('ds-input__control', className)}
        data-size={size}
        data-invalid={invalidOn ? '' : undefined}
        {...props}
      />
      {trailingAddon ? (
        <span className="ds-input__addon" aria-hidden="true">
          {trailingAddon}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
