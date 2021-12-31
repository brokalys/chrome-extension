import {
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table';

declare module 'react-table' {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UseSortByOptions<D>,
      UseFiltersOptions<D>,
      UsePaginationOptions<D> {}

  export interface TableState<D extends Record<string, unknown>>
    extends UseSortByState<D>,
      UseFiltersState<D>,
      UsePaginationState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseSortByColumnOptions<D>,
      UseFiltersColumnOptions<D> {}

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseSortByColumnProps<D>,
      UseFiltersColumnProps<D> {}

  export interface TableInstance<D extends object = {}>
    extends Omit<TableOptions<D>, 'columns' | 'pageCount'>,
      UseTableInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseFiltersInstanceProps<D> {}
}
