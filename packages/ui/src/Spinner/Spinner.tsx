import { forwardRef, useId, type HTMLAttributes } from 'react';
import { VisuallyHidden } from '../VisuallyHidden';
import { cx } from '../utils/cx';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Size of the spinner. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name announced by assistive technology. Defaults to "Loading". */
  label?: string;
}

/**
 * Shows that an action is in progress.
 *
 * @example
 * <Spinner label="Saving" />
 *
 * Accessibility: the root has `role="status"` and its name is the `label`, rendered as
 * visually hidden text. The graphic is `aria-hidden` and draws with `currentColor`, so it
 * follows the text colour of its parent. With `prefers-reduced-motion: reduce` it stays
 * visible but does not rotate.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className, ...props },
  ref,
) {
  const labelId = useId();
  return (
    <span
      ref={ref}
      role="status"
      aria-labelledby={labelId}
      className={cx('ds-spinner', className)}
      data-size={size}
      {...props}
    >
      <svg
        className="ds-spinner__graphic"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle className="ds-spinner__track" cx="12" cy="12" r="9" />
        <path className="ds-spinner__arc" d="M12 3a9 9 0 0 1 9 9" />
      </svg>
      <VisuallyHidden id={labelId}>{label}</VisuallyHidden>
    </span>
  );
});

Spinner.displayName = 'Spinner';
