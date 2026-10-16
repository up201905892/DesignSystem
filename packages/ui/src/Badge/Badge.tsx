import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '../utils/Slot';
import { cx } from '../utils/cx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour role of the badge. */
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** `subtle` uses a light background; `solid` uses a strong background. */
  appearance?: 'subtle' | 'solid';
  /** Size of the badge. */
  size?: 'sm' | 'md';
  /** Render the child element (for example an `<a href>`) instead of a `<span>`. */
  asChild?: boolean;
}

/**
 * A short label for a status or a count, such as "Active" or "3".
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="danger" appearance="solid" size="sm">3</Badge>
 *
 * Accessibility: a badge is static text with no role of its own. The meaning must be in
 * the text, never in the colour alone. Long text stays on one line and is cut with an
 * ellipsis when it reaches the width of its container.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', appearance = 'subtle', size = 'md', asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      ref={ref}
      className={cx('ds-badge', className)}
      data-variant={variant}
      data-appearance={appearance}
      data-size={size}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';
