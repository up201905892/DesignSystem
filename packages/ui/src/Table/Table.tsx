import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@ds/icons';
import { cx } from '../utils/cx';

type Align = 'start' | 'center' | 'end';

interface TableBaseProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Density of the rows. */
  size?: 'sm' | 'md';
  /** Alternate background on the body rows. */
  striped?: boolean;
  /**
   * Keep the header visible while the body scrolls. The scroll happens inside the container:
   * give it a height with the `--ds-table-max-height` custom property on an ancestor.
   */
  stickyHeader?: boolean;
}

/** A table needs a name, because its scroll container is a focusable region. */
export type TableProps = TableBaseProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-labelledby': string; 'aria-label'?: string }
  );

/**
 * A semantic data table built from native elements. The `aria-label` or `aria-labelledby`
 * names the scroll container (a focusable region) and the table itself.
 *
 * @example
 * <Table aria-label="Users">
 *   <TableHead><TableRow><TableHeaderCell>Name</TableHeaderCell></TableRow></TableHead>
 *   <TableBody><TableRow><TableCell>Ada</TableCell></TableRow></TableBody>
 * </Table>
 *
 * Accessibility: the container has `role="region"` and `tabIndex={0}`, so keyboard users
 * can Tab to it and scroll horizontally with the arrow keys.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    size = 'md',
    striped = false,
    stickyHeader = false,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...props
  },
  ref,
) {
  return (
    <div
      className="ds-table-container"
      role="region"
      // A scrollable region must be reachable by keyboard (axe: scrollable-region-focusable).
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      <table
        ref={ref}
        className={cx('ds-table', className)}
        data-size={size}
        data-striped={striped ? 'true' : undefined}
        data-sticky-header={stickyHeader ? 'true' : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...props}
      />
    </div>
  );
});

Table.displayName = 'Table';

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
  /** Name the table for assistive technology without showing the caption. */
  visuallyHidden?: boolean;
}

/** The visible (or visually hidden) title of the table. */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ visuallyHidden = false, className, ...props }, ref) {
    return (
      <caption
        ref={ref}
        className={cx('ds-table__caption', className)}
        data-visually-hidden={visuallyHidden ? 'true' : undefined}
        {...props}
      />
    );
  },
);

TableCaption.displayName = 'TableCaption';

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

/** The `<thead>` group. */
export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(function TableHead(
  { className, ...props },
  ref,
) {
  return <thead ref={ref} className={cx('ds-table__head', className)} {...props} />;
});

TableHead.displayName = 'TableHead';

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/** The `<tbody>` group. */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref,
) {
  return <tbody ref={ref} className={cx('ds-table__body', className)} {...props} />;
});

TableBody.displayName = 'TableBody';

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Mark the row as selected (`aria-selected` and `data-selected`). */
  selected?: boolean;
}

/** A table row. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected, className, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      className={cx('ds-table__row', className)}
      aria-selected={selected}
      data-selected={selected ? 'true' : undefined}
      {...props}
    />
  );
});

TableRow.displayName = 'TableRow';

export interface TableHeaderCellProps extends Omit<
  ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  /** Whether the cell heads a column or a row. */
  scope?: 'col' | 'row';
  /** Horizontal alignment of the content. */
  align?: Align;
  /** Make the column sortable: the content goes inside a button and the cell gets `aria-sort`. */
  sortable?: boolean;
  /** Current sort direction of the column. Only used when `sortable`. */
  sortDirection?: 'asc' | 'desc' | 'none';
  /** Called when the sort button is activated. */
  onSort?: () => void;
}

const ariaSort = { asc: 'ascending', desc: 'descending', none: 'none' } as const;
const sortIcon = { asc: ArrowUpIcon, desc: ArrowDownIcon, none: ArrowUpDownIcon } as const;

/**
 * A header cell (`<th>`). When `sortable`, the state is announced by `aria-sort` and
 * the icon is decorative.
 */
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell(
    {
      scope = 'col',
      align = 'start',
      sortable = false,
      sortDirection = 'none',
      onSort,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const SortIcon = sortIcon[sortDirection];
    return (
      <th
        ref={ref}
        className={cx('ds-table__header-cell', className)}
        scope={scope}
        data-align={align}
        data-sortable={sortable ? 'true' : undefined}
        aria-sort={sortable ? ariaSort[sortDirection] : undefined}
        {...props}
      >
        {sortable ? (
          <button type="button" className="ds-table__sort-button" onClick={onSort}>
            {children}
            <SortIcon className="ds-table__sort-icon" />
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);

TableHeaderCell.displayName = 'TableHeaderCell';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Horizontal alignment of the content. */
  align?: Align;
  /** Right-align and use tabular figures, for numbers. */
  numeric?: boolean;
}

/** A data cell (`<td>`). */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align, numeric = false, className, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cx('ds-table__cell', className)}
      data-align={align ?? (numeric ? 'end' : 'start')}
      data-numeric={numeric ? 'true' : undefined}
      {...props}
    />
  );
});

TableCell.displayName = 'TableCell';
