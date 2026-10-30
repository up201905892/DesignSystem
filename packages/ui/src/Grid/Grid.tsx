import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { Slot } from '../utils/Slot';
import { cx } from '../utils/cx';
import type { SpaceKey } from '../Stack/Stack';

interface GridBaseProps extends HTMLAttributes<HTMLDivElement> {
  /** Space between cells, as a key of the spacing scale. Resolved to `var(--ds-space-*)`. */
  gap?: SpaceKey;
  /** Render the child element (for example a `<ul>` or `<section>`) instead of a `<div>`. */
  asChild?: boolean;
}

interface GridFixedColumns extends GridBaseProps {
  /** Number of equal columns. Without `columns` or `minColumnWidth` there is one column. */
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  minColumnWidth?: never;
}

interface GridResponsiveColumns extends GridBaseProps {
  /**
   * Minimum width of a column, as any CSS length (for example `12rem`). The grid fits as
   * many columns as there are room for (`auto-fit` + `minmax`), without media queries.
   * This value is the only one in the library that is not a token: it is written by the
   * consumer and passed to the CSS custom property `--ds-grid-min-column`.
   */
  minColumnWidth: string;
  columns?: never;
}

export type GridProps = GridFixedColumns | GridResponsiveColumns;

/**
 * Lays out its children on a CSS grid, with equal columns or a responsive column width.
 *
 * @example
 * <Grid columns={3} gap={4}>
 *   <Card>...</Card>
 * </Grid>
 * <Grid minColumnWidth="14rem">...</Grid>
 *
 * Accessibility: a Grid has no role and is not focusable. It never reorders children, so
 * the DOM order is the visual order. Use `asChild` to render a semantic element such as
 * `<ul>` (its `<li>` stay direct children) or `<section>`.
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns, minColumnWidth, gap = 4, asChild = false, className, style, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  const vars =
    minColumnWidth !== undefined
      ? ({ '--ds-grid-min-column': minColumnWidth } as CSSProperties)
      : undefined;
  return (
    <Comp
      ref={ref}
      className={cx('ds-grid', className)}
      data-gap={gap}
      data-columns={minColumnWidth !== undefined ? undefined : (columns ?? 1)}
      data-responsive={minColumnWidth !== undefined ? 'true' : undefined}
      style={vars || style ? { ...vars, ...style } : undefined}
      {...props}
    />
  );
});

Grid.displayName = 'Grid';

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns the item spans (a positive whole number). A span larger than the
   * number of columns creates extra implicit columns, so keep it within `columns`.
   */
  colSpan?: number;
  /** Render the child element (for example an `<li>`) instead of a `<div>`. */
  asChild?: boolean;
}

/** A cell of a {@link Grid} that can span several columns. It has no role. */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(function GridItem(
  { colSpan, asChild = false, className, style, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  const vars =
    colSpan !== undefined ? ({ '--ds-grid-col-span': colSpan } as CSSProperties) : undefined;
  return (
    <Comp
      ref={ref}
      className={cx('ds-grid-item', className)}
      data-col-span={colSpan}
      style={vars || style ? { ...vars, ...style } : undefined}
      {...props}
    />
  );
});

GridItem.displayName = 'GridItem';
