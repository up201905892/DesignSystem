import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '../utils/Slot';
import { cx } from '../utils/cx';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  /** Render the child element instead of a `<span>`, merging props into it. */
  asChild?: boolean;
}

/**
 * Hides content visually while keeping it available to assistive technology.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ asChild = false, className, ...props }, ref) {
    const Comp = asChild ? Slot : 'span';
    return <Comp ref={ref} className={cx('ds-visually-hidden', className)} {...props} />;
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
