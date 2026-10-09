import { forwardRef, type HTMLAttributes } from 'react';

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Hides content visually while keeping it available to assistive technology.
 * Minimal export for DS-002; styling and `asChild` arrive in a later task.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden(props, ref) {
    return <span ref={ref} {...props} />;
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
