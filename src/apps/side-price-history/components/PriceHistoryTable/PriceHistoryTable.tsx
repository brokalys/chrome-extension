import type { Property } from 'csstype';
import {
  EmptyState,
  ErrorIcon,
  Pagination,
  Pane,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  Spinner,
  Table,
  minorScale,
} from 'evergreen-ui';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import type { Cell, Column, Filters } from 'react-table';

import type { Classified, CrawledClassified } from 'src/types';

import PriceSummary from '../PriceSummary';

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
  pageClassified: CrawledClassified;
  filters: Filters<Classified>;
  error: Error | undefined;
}

const PriceHistoryTable: React.FC<PriceHistoryTableProps> = ({
  isLoading,
  data,
  pageClassified,
  filters,
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
        hiddenColumns: ['rent_type'],
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
      {pageClassified.category !== 'land' && (
        <PriceSummary prices={prices} pricesPerSqm={pricesPerSqm} />
      )}

      <Table data-testid="data-table" aria-live="polite" aria-busy={isLoading}>
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
                    (column.isSortedDesc ? <SortDescIcon /> : <SortAscIcon />)}

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
          ) : pageClassified.category === 'land' ? (
            <EmptyState
              background="light"
              title="Price history unavailable"
              orientation="horizontal"
              icon={<SearchIcon color="#C1C4D6" />}
              iconBgColor="#EDEFF5"
              description="Unfortunately LAND type classifieds currently do not have price history. Interested in this feature? Submit a feature request!"
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
              title="No classifieds could be found with the given filters"
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
