import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, MinusIcon } from '@ds/icons';
import { cx } from '../utils/cx';
import { useFieldControl } from '../Field';

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'asChild' | 'children'
> {
  /** Size of the box (16px or 20px). The clickable area is at least 24x24px. */
  size?: 'sm' | 'md';
  /** Marks the checkbox as invalid (`aria-invalid` and the danger border). */
  invalid?: boolean;
  /** Optional label, associated with the control; clicking it toggles the checkbox. */
  children?: ReactNode;
}

/**
 * A checkbox with three states: checked, unchecked and indeterminate (`aria-checked="mixed"`).
 * `ref`, `className` and the native props go to the root `<button role="checkbox">`.
 *
 * @example
 * <Checkbox defaultChecked name="terms">I accept the terms</Checkbox>
 *
 * Accessibility: Space toggles; Enter does not (APG). Inside a `Field` it gets `id`,
 * `aria-describedby`, `aria-invalid`, `aria-required` and `disabled` (props passed directly win).
 * Without `children` give it a name with `aria-label` or a `Field` label.
 */
export const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox(
    {
      size = 'md',
      invalid,
      children,
      className,
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
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
      <label
        className="ds-checkbox"
        data-size={size}
        data-invalid={invalidOn ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          id={id ?? field.id}
          disabled={isDisabled}
          required={required ?? !!field['aria-required']}
          aria-describedby={ariaDescribedBy ?? field['aria-describedby']}
          aria-invalid={ariaInvalidValue}
          className={cx('ds-checkbox__control', className)}
          data-size={size}
          data-invalid={invalidOn ? '' : undefined}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="ds-checkbox__indicator">
            <CheckIcon className="ds-checkbox__icon ds-checkbox__icon--check" />
            <MinusIcon className="ds-checkbox__icon ds-checkbox__icon--minus" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {children ? <span className="ds-checkbox__label">{children}</span> : null}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
