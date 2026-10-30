import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Spinner } from '../Spinner';
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
   * are blocked. Unlike `loading`, a disabled button is taken out of the Tab order.
   */
  disabled?: boolean;
  /**
   * Show that an action is in progress. A `Spinner` replaces the `leadingIcon` (a span is
   * created if there is none), the root gets `aria-busy`, `aria-disabled` and `data-loading`,
   * and clicks are blocked (no `onClick`, no form submit, no navigation with `asChild`).
   *
   * Intentional difference from `disabled`: a loading button stays focusable and in the Tab
   * order, so keyboard and screen reader users do not lose their place while the action runs
   * and can carry on from the same point when it ends. If `disabled` is also set, `disabled`
   * wins and the button leaves the Tab order.
   *
   * The button does not announce the outcome. The consumer must communicate success or
   * error with a `Toast` or another visible, announced feedback.
   */
  loading?: boolean;
  /**
   * Visually hidden text that becomes the accessible description while `loading`
   * (via `aria-describedby`). The button name does not change.
   * @default "Loading"
   */
  loadingLabel?: string;
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
 * unless `type="submit"` is passed. A disabled button leaves the Tab order; a loading one stays focusable.
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
    loading = false,
    loadingLabel = 'Loading',
    className,
    type,
    children,
    onClickCapture,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  const spinnerId = useId();

  const ariaDisabled = disabled || loading ? { 'aria-disabled': true as const } : {};
  const rootProps = asChild
    ? {
        ...ariaDisabled,
        ...(disabled ? { tabIndex: -1 } : {}),
        onClickCapture: disabled || loading ? blockClick : onClickCapture,
      }
    : {
        ...(loading ? ariaDisabled : {}),
        type: type ?? 'button',
        disabled,
        onClickCapture: loading ? blockClick : onClickCapture,
      };
  const loadingProps = loading
    ? {
        'aria-busy': true as const,
        'data-loading': '',
        'aria-describedby': [describedBy, spinnerId].filter(Boolean).join(' '),
      }
    : { 'aria-describedby': describedBy };
  const leading = loading ? <Spinner id={spinnerId} size="sm" label={loadingLabel} /> : leadingIcon;

  return (
    <Comp
      ref={ref}
      className={cx('ds-button', className)}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...props}
      {...loadingProps}
      {...rootProps}
    >
      {leading ? (
        <span className="ds-button__icon" aria-hidden="true">
          {leading}
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
