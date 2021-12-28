import {
  Pane,
  Pagination,
  Table,
  SortDescIcon,
  SortAscIcon,
  Spinner,
  minorScale,
  EmptyState,
  SearchIcon,
} from 'evergreen-ui';
import { useFilters, usePagination, useTable, useSortBy } from 'react-table';
import moment from 'moment';
import React from 'react';

const RENT_TYPE_SUFFIX = {
  yearly: '/y',
  monthly: '/m',
  weekly: '/w',
  daily: '/d',
  hourly: '/h',
};

const columns = [
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
        {original.type === 'rent' && RENT_TYPE_SUFFIX[original.rent_type]}
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
          {parseFloat(value).toLocaleString()} €/m
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
    Header: 'Published at',
    Cell: ({ value }) =>
      value ? moment(value).format('YYYY-MM-DD HH:mm') : 'Before 2018',
    accessor: 'published_at',
    width: 1000,
    minWidth: 1000,
    maxWidth: 1000,
    flexBasis: 1000,
  },
];

function getCellTextAlign(cell) {
  if (['category', 'type'].includes(cell.column.id)) {
    return 'left';
  }

  return 'right';
}

function getColumnFlexBasis(column) {
  switch (column.id) {
    case 'published_at':
    case 'calc_price_per_sqm':
    case 'price':
      return 70;
    default:
      return undefined;
  }
}

export default function PriceHistoryTable(props) {
  const {
    headerGroups,
    page,
    prepareRow,

    // Filtering
    setAllFilters,

    // Pagination
    pageCount,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: props.data,
      initialState: {
        sortBy: [
          {
            id: 'published_at',
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

  React.useEffect(() => {
    setAllFilters(props.filters);
  }, [props.filters, setAllFilters]);

  const hasResults = page.length > 0;

  return (
    <>
      <Table>
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
          {props.isLoading ? (
            <Pane
              backgroundColor="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={64}
            >
              <Spinner />
            </Pane>
          ) : props.data.length === 0 ? (
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
}
