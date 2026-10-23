import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '../utils/Slot';
import { cx } from '../utils/cx';

/** A key of the spacing scale (`--ds-space-<key>`). Other numbers do not compile. */
export type SpaceKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Main axis: `vertical` stacks children in a column, `horizontal` in a row. */
  direction?: 'vertical' | 'horizontal';
  /** Space between children, as a key of the spacing scale. Resolved to `var(--ds-space-*)`. */
  gap?: SpaceKey;
  /** Alignment on the cross axis. Without it the children stretch. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Distribution on the main axis. Without it the children start at the beginning. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Let children wrap onto new lines when they do not fit. */
  wrap?: boolean;
  /** Render the child element (for example a `<ul>` or `<nav>`) instead of a `<div>`. */
  asChild?: boolean;
}

/**
 * Lays out its children in one direction with a fixed gap taken from the spacing tokens.
 *
 * @example
 * <Stack gap={3}>
 *   <Field>...</Field>
 *   <Button>Save</Button>
 * </Stack>
 *
 * Accessibility: a Stack has no role and is not focusable. The DOM order is the visual
 * order (it never reorders children), so keyboard and screen reader order match what is
 * seen. Use `asChild` to render a semantic element such as `<ul>`, `<section>` or `<nav>`.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    direction = 'vertical',
    gap = 4,
    align,
    justify,
    wrap = false,
    asChild = false,
    className,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cx('ds-stack', className)}
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? 'true' : undefined}
      {...props}
    />
  );
});

Stack.displayName = 'Stack';
