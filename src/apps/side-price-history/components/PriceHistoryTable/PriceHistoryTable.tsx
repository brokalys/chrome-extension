import type { Property } from 'csstype';
import {
  EmptyState,
  ErrorIcon,
  FilterIcon,
  Link,
  Pagination,
  Pane,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  Spinner,
  Table,
  Text,
  minorScale,
} from 'evergreen-ui';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import type { Cell, Column, Filters } from 'react-table';

import type { Classified, CrawledClassified, Estate } from 'src/types';

import PriceSummary from '../PriceSummary';
import BuildingInformation from './BuildingInformation';

const RENT_TYPE_SUFFIX: Record<string, string> = {
  yearly: '/y',
  monthly: '/m',
  weekly: '/w',
  daily: '/d',
  hourly: '/h',
};

const columns: Column<Classified>[] = [
  {
    Header: 'Source',
    accessor: 'source',
    filter: 'equals',
  },
  {
    Header: 'Category',
    accessor: 'category',
    filter: 'equals',
  },
  {
    Header: 'Type',
    accessor: 'type',
    filter: 'equals',
  },
  {
    accessor: 'rent_type',
    filter: 'equals',
  },
  {
    Header: 'Total price',
    Cell: ({ row: { original } }) => (
      <>
        {original.price.toLocaleString()} €
        {original.type === 'rent' && RENT_TYPE_SUFFIX[original.rent_type || '']}
      </>
    ),
    accessor: 'price',
  },
  {
    Header: 'SQM Price',
    Cell: ({ value }) => {
      if (!value) {
        return null;
      }

      return (
        <>
          {value.toLocaleString()} €/m
          <sup>2</sup>
        </>
      );
    },
    accessor: 'calc_price_per_sqm',
  },
  {
    Header: 'Area',
    Cell: ({ value }) => {
      if (!value) {
        return null;
      }

      return (
        <>
          {value.toLocaleString()} m<sup>2</sup>
        </>
      );
    },
    accessor: 'area',
  },
  {
    Header: 'Rooms',
    accessor: 'rooms',
  },
  {
    Header: 'Floor',
    accessor: 'floor_min',
    Cell: ({
      row: {
        original: { floor_min, floor_max },
      },
    }) => {
      const isFloorMinNumber = typeof floor_min === 'number';
      const isFloorMaxNumber = typeof floor_max === 'number';

      if (!isFloorMinNumber) {
        if (isFloorMaxNumber) {
          return floor_max;
        }
        return null;
      }

      if (isFloorMaxNumber && floor_min !== floor_max) {
        return [floor_min, floor_max].join(' - ');
      }

      return floor_min;
    },
  },
  {
    Header: 'Date',
    Cell: ({ value, row }) =>
      value
        ? moment(value).format('YYYY-MM-DD HH:mm')
        : row.original.source === 'classified'
        ? 'Before 2018'
        : null,
    accessor: 'date',
  },
];

function getCellTextAlign(cell: Cell<Classified>): Property.TextAlign {
  if (['category', 'type'].includes(cell.column.id)) {
    return 'left';
  }

  return 'right';
}

function getColumnFlexBasis(column: Column<Classified>): number | undefined {
  switch (column.id) {
    case 'date':
    case 'calc_price_per_sqm':
    case 'price':
      return 70;
    default:
      return undefined;
  }
}

export interface PriceHistoryTableProps {
  isLoading: boolean;
  data: Classified[];
  estate: Estate | null;
  pageClassified: CrawledClassified;
  filters: Filters<Classified>;
  clearFilters: () => void;
  error: Error | undefined;
}

const PriceHistoryTable: React.FC<PriceHistoryTableProps> = ({
  isLoading,
  data,
  estate,
  pageClassified,
  filters,
  clearFilters,
  error,
}) => {
  const {
    rows,
    headerGroups,
    prepareRow,

    // Filtering
    setAllFilters,

    // Pagination
    page,
    pageCount,
    gotoPage,
    state: { pageIndex },
  } = useTable<Classified>(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'date',
            desc: true,
          },
        ],
        pageSize: 15,
        hiddenColumns: [
          'rent_type',
          ...(pageClassified.category === 'land' ? ['floor_min', 'rooms'] : []),
        ],
      },
      autoResetFilters: false,
      disableSortRemove: true,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    setAllFilters(filters);
  }, [filters, setAllFilters]);

  const hasResults = page.length > 0;
  const isFilterActive = filters.length > 0;

  const prices = useMemo(
    () => rows.map(({ values }) => values.price).filter((value) => !!value),
    [rows],
  );
  const pricesPerSqm = useMemo(
    () =>
      rows
        .map(({ values }) => values.calc_price_per_sqm)
        .filter((value) => !!value),
    [rows],
  );

  return (
    <>
      <Pane
        display="flex"
        justifyContent="center"
        flexDirection="column"
        gap={16}
      >
        <Pane
          display="flex"
          justifyContent="space-between"
          flexDirection="row"
          alignItems="stretch"
          gap={12}
        >
          {estate && <BuildingInformation estate={estate} />}
          <PriceSummary prices={prices} pricesPerSqm={pricesPerSqm} />
        </Pane>

        <Table
          data-testid="data-table"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isFilterActive && (
            <Table.Row height={40}>
              <Table.TextCell>
                <Text color="muted" size={300}>
                  <FilterIcon size={12} /> Filters applied. {rows.length}/
                  {data.length} table entries shown.{' '}
                  <Link
                    href="#"
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      clearFilters();
                    }}
                    size={300}
                  >
                    Clear filters
                  </Link>
                </Text>
              </Table.TextCell>
            </Table.Row>
          )}

          {headerGroups.map((headerGroup) => (
            <Table.Head height={30} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Table.TextHeaderCell
                  textAlign="center"
                  flexBasis={getColumnFlexBasis(column)}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <Pane display="flex" gap={minorScale(3)}>
                    {column.isSorted &&
                      (column.isSortedDesc ? (
                        <SortDescIcon />
                      ) : (
                        <SortAscIcon />
                      ))}

                    {column.render('Header')}
                  </Pane>
                </Table.TextHeaderCell>
              ))}
            </Table.Head>
          ))}

          <Table.Body>
            {isLoading ? (
              <Pane
                backgroundColor="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding={64}
              >
                <Spinner />
              </Pane>
            ) : error ? (
              <EmptyState
                background="light"
                title="An error occurred"
                orientation="horizontal"
                icon={<ErrorIcon color="danger" />}
                iconBgColor="#EDEFF5"
                description="We are experiencing some problems. Try reloading the page. If that doesn't solve it, please click the bug report button above."
              />
            ) : data.length === 0 ? (
              <EmptyState
                background="light"
                title="No price history found"
                orientation="horizontal"
                icon={<SearchIcon color="#C1C4D6" />}
                iconBgColor="#EDEFF5"
                description="Sadly no price history could be found for this property."
              />
            ) : !hasResults ? (
              <EmptyState
                background="light"
                title="No data could be found with the given filters"
                orientation="horizontal"
                icon={<SearchIcon color="#C1C4D6" />}
                iconBgColor="#EDEFF5"
                description="Clear the filters or open a different property to see data."
              />
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <Table.Row height={30} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Table.TextCell
                        textAlign={getCellTextAlign(cell)}
                        flexBasis={getColumnFlexBasis(cell.column)}
                        title={cell.value}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </Table.TextCell>
                    ))}
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
      </Pane>

      {pageCount > 1 && (
        <Pagination
          page={pageIndex + 1}
          totalPages={pageCount}
          onPageChange={(pageNum) => gotoPage(pageNum - 1)}
        />
      )}
    </>
  );
};

export default PriceHistoryTable;
