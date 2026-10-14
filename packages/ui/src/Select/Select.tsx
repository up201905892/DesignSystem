import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@ds/icons';
import { cx } from '../utils/cx';
import { useFieldControl } from '../Field';

export interface SelectProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'size' | 'value' | 'defaultValue' | 'onChange'
> {
  /** Selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value when an item is selected. */
  onValueChange?: (value: string) => void;
  /** Whether the list is open (controlled). */
  open?: boolean;
  /** Whether the list starts open (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Text shown while no value is selected. */
  placeholder?: ReactNode;
  /** Prevents opening the list. */
  disabled?: boolean;
  /** Marks the select as required (`aria-required`, and native form validation). */
  required?: boolean;
  /** Name of the value in a form (`FormData`). */
  name?: string;
  /** Size of the trigger; sets its minimum height (32px, 40px or 48px). */
  size?: 'sm' | 'md' | 'lg';
  /** Marks the select as invalid (`aria-invalid` and the danger border). */
  invalid?: boolean;
  /** The `SelectItem`, `SelectGroup` and `SelectSeparator` elements of the list. */
  children?: ReactNode;
}

/**
 * Single-selection list. `ref`, `className` and the native props go to the trigger
 * (`role="combobox"`); the list is rendered in a portal.
 *
 * @example
 * <Field>
 *   <FieldLabel>Country</FieldLabel>
 *   <Select placeholder="Choose">
 *     <SelectItem value="pt">Portugal</SelectItem>
 *     <SelectItem value="es">Spain</SelectItem>
 *   </Select>
 * </Field>
 *
 * Accessibility: follows the APG select-only combobox pattern (Enter, Space and arrows open;
 * arrows, Home, End and typing move the active item; Esc closes). Inside a `Field` it gets
 * `id`, `aria-describedby`, `aria-invalid`, `aria-required` and `disabled` automatically.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    placeholder,
    disabled,
    required,
    name,
    size = 'md',
    invalid,
    className,
    children,
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    ...props
  },
  ref,
) {
  const field = useFieldControl();
  const [innerOpen, setInnerOpen] = useState(!!defaultOpen);
  const isOpen = open ?? innerOpen;
  const isDisabled = disabled ?? field.disabled ?? false;
  const isRequired = required ?? !!field['aria-required'];
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
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => {
        setInnerOpen(next);
        onOpenChange?.(next);
      }}
      disabled={isDisabled}
      required={isRequired}
      name={name}
    >
      <RadixSelect.Trigger
        ref={ref}
        id={id ?? field.id}
        aria-describedby={ariaDescribedBy ?? field['aria-describedby']}
        aria-invalid={ariaInvalidValue}
        aria-required={ariaRequired ?? (isRequired ? true : undefined)}
        className={cx('ds-select', className)}
        // While open, Radix hides everything outside the list (`aria-hidden`) and traps focus in
        // it, so the trigger must not stay in the tab order inside a hidden subtree.
        tabIndex={isOpen ? -1 : undefined}
        data-size={size}
        data-invalid={invalidOn ? '' : undefined}
        {...props}
      >
        <span className="ds-select__value">
          <RadixSelect.Value placeholder={placeholder} />
        </span>
        <RadixSelect.Icon asChild>
          <ChevronDownIcon className="ds-select__icon" aria-hidden="true" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="ds-select__content" position="popper" sideOffset={4}>
          <RadixSelect.Viewport className="ds-select__viewport">{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});

Select.displayName = 'Select';

export interface SelectItemProps extends ComponentPropsWithoutRef<typeof RadixSelect.Item> {
  /** Value of the item (required, not empty). */
  value: string;
  /** Prevents selecting the item; it is skipped by the keyboard. */
  disabled?: boolean;
}

/** An option of the `Select` list; shows a check mark when selected. */
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, ...props },
  ref,
) {
  return (
    <RadixSelect.Item ref={ref} className={cx('ds-select__item', className)} {...props}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="ds-select__indicator">
        <CheckIcon aria-hidden="true" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

SelectItem.displayName = 'SelectItem';

export interface SelectGroupProps extends ComponentPropsWithoutRef<typeof RadixSelect.Group> {
  /** Visible heading of the group; it also names the group. */
  label: string;
}

/** Groups items under a heading. */
export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { label, className, children, ...props },
  ref,
) {
  return (
    <RadixSelect.Group ref={ref} className={cx('ds-select__group', className)} {...props}>
      <RadixSelect.Label className="ds-select__label">{label}</RadixSelect.Label>
      {children}
    </RadixSelect.Group>
  );
});

SelectGroup.displayName = 'SelectGroup';

export type SelectSeparatorProps = ComponentPropsWithoutRef<typeof RadixSelect.Separator>;

/** A thin line between items or groups. */
export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  function SelectSeparator({ className, ...props }, ref) {
    return (
      <RadixSelect.Separator
        ref={ref}
        className={cx('ds-select__separator', className)}
        {...props}
      />
    );
  },
);

SelectSeparator.displayName = 'SelectSeparator';
