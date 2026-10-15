import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cx } from '../utils/cx';
import { useFieldControl } from '../Field';

type RadioGroupName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-labelledby': string; 'aria-label'?: string };

export type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  'asChild' | 'orientation' | 'aria-label' | 'aria-labelledby'
> & {
  /** Layout of the options and `aria-orientation`. Every arrow key moves the selection. */
  orientation?: 'vertical' | 'horizontal';
  /** Marks the group as invalid (`aria-invalid`). */
  invalid?: boolean;
} & RadioGroupName;

/**
 * A group of mutually exclusive options (`role="radiogroup"`) with roving tabindex.
 * `ref`, `className` and the native props go to the root element. It needs an accessible
 * name: pass `aria-label` or `aria-labelledby`.
 *
 * @example
 * <RadioGroup aria-label="Plan" defaultValue="free" name="plan">
 *   <Radio value="free">Free</Radio>
 *   <Radio value="pro">Pro</Radio>
 * </RadioGroup>
 *
 * Accessibility: Tab enters on the selected radio (or the first enabled one); all four arrow
 * keys move and select, wrapping around and skipping disabled radios; Space selects.
 * Inside a `Field` it gets `aria-describedby`, `aria-invalid`, `required` and `disabled`
 * (props passed directly win).
 */
export const RadioGroup = forwardRef<ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  function RadioGroup(
    {
      orientation = 'vertical',
      invalid,
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
      <RadioGroupPrimitive.Root
        ref={ref}
        id={id ?? field.id}
        disabled={isDisabled}
        required={required ?? !!field['aria-required']}
        aria-describedby={ariaDescribedBy ?? field['aria-describedby']}
        aria-invalid={ariaInvalidValue}
        // The orientation is not given to Radix: it would disable Left/Right in a
        // vertical group, and the APG expects all four arrow keys.
        aria-orientation={orientation}
        className={cx('ds-radio-group', className)}
        data-orientation={orientation}
        data-invalid={invalidOn ? '' : undefined}
        {...props}
      />
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioProps extends Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  'asChild' | 'children'
> {
  /** Value of the option (required). */
  value: string;
  /** Size of the circle (16px or 20px). The clickable area is at least 24x24px. */
  size?: 'sm' | 'md';
  /** Label of the option, associated with the control; clicking it selects the radio. */
  children?: ReactNode;
}

/**
 * One option of a `RadioGroup` (`role="radio"`). `ref`, `className` and the native props go to
 * the `<button>`; the surrounding `<label>` makes the whole row clickable.
 */
export const Radio = forwardRef<ElementRef<typeof RadioGroupPrimitive.Item>, RadioProps>(
  function Radio({ size = 'md', children, className, ...props }, ref) {
    return (
      <label className="ds-radio" data-size={size}>
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cx('ds-radio__control', className)}
          data-size={size}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="ds-radio__indicator" />
        </RadioGroupPrimitive.Item>
        {children ? <span className="ds-radio__label">{children}</span> : null}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
