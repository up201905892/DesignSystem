import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Shape of the placeholder. */
  variant?: 'text' | 'rect' | 'circle';
  /** Width. Numbers are pixels; strings are any CSS length. */
  width?: number | string;
  /** Height. Numbers are pixels; strings are any CSS length. */
  height?: number | string;
  /** Number of text lines. Only for the `text` variant. */
  lines?: number;
}

const toCss = (value: number | string): string =>
  typeof value === 'number' ? `${value}px` : value;

/**
 * A placeholder for content that has not loaded yet.
 *
 * @example
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="circle" width={48} height={48} />
 *
 * Accessibility: the skeleton is `aria-hidden` and never takes focus. Tell assistive
 * technology that content is loading elsewhere, for example with `aria-busy` on the
 * container or a `Spinner`. The shimmer stops with `prefers-reduced-motion: reduce`.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, lines, className, style, ...props },
  ref,
) {
  const vars: Record<string, string> = {};
  if (width !== undefined) vars['--ds-skeleton-width'] = toCss(width);
  if (height !== undefined) vars['--ds-skeleton-height'] = toCss(height);
  const count = variant === 'text' && lines !== undefined ? Math.max(1, Math.floor(lines)) : 0;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx('ds-skeleton', className)}
      data-variant={variant}
      style={{ ...vars, ...style } as CSSProperties}
      {...props}
    >
      {count > 0
        ? Array.from({ length: count }, (_, i) => <span key={i} className="ds-skeleton__line" />)
        : null}
    </div>
  );
});

Skeleton.displayName = 'Skeleton';
