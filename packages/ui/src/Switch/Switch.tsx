import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cx } from '../utils/cx';
import { useFieldControl } from '../Field';

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  'asChild' | 'children'
> {
  /** Size of the track (md: 40x24px, sm: 32x20px). The clickable area is at least 24px high. */
  size?: 'sm' | 'md';
  /** Optional label, associated with the control; clicking it toggles the switch. */
  children?: ReactNode;
}

/**
 * An on/off switch for settings that take effect immediately.
 * `ref`, `className` and the native props go to the root `<button role="switch">`.
 *
 * @example
 * <Switch defaultChecked name="notifications">Notifications</Switch>
 *
 * Accessibility: Space and Enter toggle. The state is shown by the thumb position, not only by
 * colour. Inside a `Field` it gets `id`, `aria-describedby`, `aria-required` and `disabled`
 * (props passed directly win). Without `children` give it a name with `aria-label` or a `Field` label.
 */
export const Switch = forwardRef<ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  function Switch(
    {
      size = 'md',
      children,
      className,
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const field = useFieldControl();
    const isDisabled = disabled ?? field.disabled ?? false;

    return (
      <label className="ds-switch" data-size={size} data-disabled={isDisabled ? '' : undefined}>
        <SwitchPrimitive.Root
          ref={ref}
          id={id ?? field.id}
          disabled={isDisabled}
          required={required ?? !!field['aria-required']}
          aria-describedby={ariaDescribedBy ?? field['aria-describedby']}
          className={cx('ds-switch__control', className)}
          data-size={size}
          {...props}
        >
          <SwitchPrimitive.Thumb className="ds-switch__thumb" />
        </SwitchPrimitive.Root>
        {children ? <span className="ds-switch__label">{children}</span> : null}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
