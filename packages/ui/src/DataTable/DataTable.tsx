import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../utils/cx';
import { Pagination, usePagination } from '../Pagination';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  useTableSort,
  type TableSortColumn,
  type TableSortState,
} from '../Table';

export interface DataTableColumn<T> {
  /** Unique id of the column. */
  id: string;
  /** Content of the header cell. */
  header: ReactNode;
  /** A key of the row, or a function that reads the value to show and to sort by. */
  accessor: keyof T | ((row: T) => unknown);
  /** Render the cell yourself. Receives the typed row. Defaults to the accessor value. */
  cell?: (row: T) => ReactNode;
  /** Let the user sort by this column. @default false */
  sortable?: boolean;
  /** Own comparison, ascending. The direction is applied for you. */
  compare?: (a: T, b: T) => number;
  /** Horizontal alignment of the header and the cells. */
  align?: 'start' | 'center' | 'end';
  /** Right-align and use tabular figures, for numbers. */
  numeric?: boolean;
}

export interface DataTableRange {
  /** 1-based position of the first row on the page. */
  start: number;
  /** 1-based position of the last row on the page. */
  end: number;
  /** Number of rows in all pages. */
  total: number;
}

export interface DataTableProps<T> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange'
> {
  /** The rows. They are never changed; sorting works on a copy. */
  data: readonly T[];
  columns: ReadonlyArray<DataTableColumn<T>>;
  /** Stable, unique id of a row; used as the React key. */
  getRowId: (row: T) => string;
  /** The title of the table. It also names the table for assistive technology. */
  caption: ReactNode;
  /** Hide the caption visually but keep it for assistive technology. */
  captionHidden?: boolean;
  /** Rows per page. `0` turns the pagination off. @default 10 */
  pageSize?: number;
  /** Initial sort when uncontrolled. */
  defaultSort?: TableSortState | null;
  /** Controlled sort. Use together with `onSortChange`. */
  sort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
  /** Controlled page (1-based). Use together with `onPageChange`. */
  page?: number;
  onPageChange?: (page: number) => void;
  /** Shown in a single row when `data` is empty. @default "No results" */
  emptyMessage?: ReactNode;
  /** Text of the summary below the table. @default `${start}–${end} of ${total}` */
  getRangeLabel?: (range: DataTableRange) => ReactNode;
  /** Density of the rows. @default "md" */
  size?: 'sm' | 'md';
  /** Alternate background on the rows. */
  striped?: boolean;
}

function toNode(value: unknown): ReactNode {
  if (value === null || value === undefined || typeof value === 'boolean') return null;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

const defaultRangeLabel = ({ start, end, total }: DataTableRange) => `${start}–${end} of ${total}`;

function DataTableInner<T>(
  {
    data,
    columns,
    getRowId,
    caption,
    captionHidden = false,
    pageSize = 10,
    defaultSort,
    sort,
    onSortChange,
    page: pageProp,
    onPageChange,
    emptyMessage = 'No results',
    getRangeLabel = defaultRangeLabel,
    size,
    striped,
    className,
    ...props
  }: DataTableProps<T>,
  ref: Ref<HTMLDivElement>,
) {
  const captionId = useId();
  const paginated = pageSize > 0;

  // Sorting applies to all the data, so the page count only depends on the data length.
  const pagination = usePagination({
    totalItems: data.length,
    pageSize: paginated ? pageSize : Math.max(data.length, 1),
    page: pageProp,
    onPageChange,
  });

  const sortColumns = useMemo<TableSortColumn<T>[]>(
    () =>
      columns.map((column) => ({
        id: column.id,
        compare: column.compare,
        accessor:
          typeof column.accessor === 'function'
            ? column.accessor
            : (row: T) => row[column.accessor as keyof T],
      })),
    [columns],
  );

  const { sortedData, getSortProps } = useTableSort<T>({
    data,
    columns: sortColumns,
    sort,
    defaultSort,
    onSortChange: (next) => {
      pagination.setPage(1);
      onSortChange?.(next);
    },
  });

  const rows = paginated
    ? sortedData.slice(pagination.startIndex, pagination.endIndex)
    : sortedData;

  const range: DataTableRange = {
    start: pagination.startIndex + 1,
    end: pagination.endIndex,
    total: data.length,
  };

  return (
    <div ref={ref} className={cx('ds-data-table', className)} {...props}>
      <Table aria-labelledby={captionId} size={size} striped={striped}>
        <TableCaption id={captionId} visuallyHidden={captionHidden}>
          {caption}
        </TableCaption>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell
                key={column.id}
                align={column.align ?? (column.numeric ? 'end' : 'start')}
                {...(column.sortable ? getSortProps(column.id) : {})}
              >
                {column.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>{emptyMessage}</TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} numeric={column.numeric}>
                    {column.cell
                      ? column.cell(row)
                      : toNode(
                          typeof column.accessor === 'function'
                            ? column.accessor(row)
                            : row[column.accessor],
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {paginated && data.length > 0 ? (
        <div className="ds-data-table__footer">
          <p className="ds-data-table__summary" aria-live="polite">
            {getRangeLabel(range)}
          </p>
          <Pagination
            pageCount={pagination.pageCount}
            page={pagination.page}
            onPageChange={pagination.setPage}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * A table with sorting and pagination, built from a column definition. It only composes
 * `Table`, `useTableSort`, `usePagination` and `Pagination`. Sorting applies to all the data
 * before it is paginated, and changing the sort goes back to page 1.
 *
 * @example
 * <DataTable
 *   caption="Users"
 *   data={users}
 *   getRowId={(user) => user.id}
 *   columns={[
 *     { id: 'name', header: 'Name', accessor: 'name', sortable: true },
 *     { id: 'age', header: 'Age', accessor: 'age', sortable: true, numeric: true },
 *   ]}
 * />
 *
 * Accessibility: the caption names the table; the range summary is in an `aria-live="polite"`
 * element, so a page change is announced. Tab order: sortable headers, interactive cells, pagination.
 */
export const DataTable = forwardRef(DataTableInner) as (<T>(
  props: DataTableProps<T> & { ref?: Ref<HTMLDivElement> },
) => ReactNode) & { displayName?: string };

DataTable.displayName = 'DataTable';
