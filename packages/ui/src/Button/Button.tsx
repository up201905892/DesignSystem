import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Slot, Slottable } from '../utils/Slot';
import { cx } from '../utils/cx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size of the button; sets its minimum height (32px, 40px or 48px). */
  size?: 'sm' | 'md' | 'lg';
  /** Make the button fill the width of its container. */
  fullWidth?: boolean;
  /** Decorative icon rendered before the content (wrapped in an `aria-hidden` span). */
  leadingIcon?: ReactNode;
  /** Decorative icon rendered after the content (wrapped in an `aria-hidden` span). */
  trailingIcon?: ReactNode;
  /**
   * Render the child element (for example an `<a href>`) instead of a `<button>`,
   * merging classes, `data-*` attributes and the ref into it.
   */
  asChild?: boolean;
  /**
   * Disable the button. A native `<button>` uses the `disabled` attribute and leaves the
   * Tab order. With `asChild`, the child gets `aria-disabled`, `tabIndex={-1}` and clicks
   * are blocked.
   */
  disabled?: boolean;
}

function blockClick(event: MouseEvent<HTMLElement>) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * A button for actions, or a link styled as a button when used with `asChild`.
 *
 * @example
 * <Button variant="secondary" leadingIcon={<PlusIcon />}>Add</Button>
 * <Button asChild><a href="/docs">Docs</a></Button>
 *
 * Accessibility: works with the keyboard alone (Tab to focus, Enter and Space to activate)
 * and shows a visible focus ring. The accessible name comes from the text only, because
 * icons are `aria-hidden`. `type` defaults to `"button"`, so it does not submit forms
 * unless `type="submit"` is passed. A disabled button leaves the Tab order.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    asChild = false,
    disabled = false,
    className,
    type,
    children,
    onClickCapture,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';

  const rootProps = asChild
    ? {
        ...(disabled ? { 'aria-disabled': true, tabIndex: -1 } : {}),
        onClickCapture: disabled ? blockClick : onClickCapture,
      }
    : { type: type ?? 'button', disabled, onClickCapture };

  return (
    <Comp
      ref={ref}
      className={cx('ds-button', className)}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...props}
      {...rootProps}
    >
      {leadingIcon ? (
        <span className="ds-button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <Slottable>{children}</Slottable>
      {trailingIcon ? (
        <span className="ds-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </Comp>
  );
});

Button.displayName = 'Button';
