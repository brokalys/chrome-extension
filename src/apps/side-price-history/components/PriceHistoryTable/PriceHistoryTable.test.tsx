import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockClassified from 'src/__test__/mock-classified';
import mockPageClassified from 'src/__test__/mock-page-classified';

import PriceHistoryTable from './PriceHistoryTable';
import type { PriceHistoryTableProps } from './PriceHistoryTable';

const defaultProps: PriceHistoryTableProps = {
  isLoading: false,
  data: [],
  building: null,
  filters: [],
  clearFilters: jest.fn(),
  error: undefined,
  pageClassified: mockPageClassified,
};

describe('PriceHistoryTable', () => {
  it('displays a table with the results', () => {
    render(
      <PriceHistoryTable
        {...defaultProps}
        data={[
          {
            source: 'classified',
            category: 'apartment',
            type: 'rent',
            rent_type: 'monthly',
            price: 120,
            calc_price_per_sqm: 12,
            area: 10,
            rooms: 1,
            floor_min: null,
            date: '2021-11-02T08:00:00.000Z',
          },
        ]}
      />,
    );

    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('rent')).toBeInTheDocument();
    expect(screen.getByText('120 €/m')).toBeInTheDocument();
    expect(screen.getByText('12 €/m')).toBeInTheDocument();
    expect(screen.getByText('10 m')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2021-11-02 08:00')).toBeInTheDocument();
  });

  it('displays the building information block if building is found', () => {
    render(
      <PriceHistoryTable
        {...defaultProps}
        building={{
          id: 123,
          cadastral_designation: '98940060012003',
          land_cadastral_designation: '98940060055',
          object_code: '5201011110',
          area: 120,
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Building information' }),
    ).toBeInTheDocument();
  });

  it('displays no building information block if building is not found', () => {
    render(<PriceHistoryTable {...defaultProps} building={null} />);

    expect(
      screen.queryByRole('heading', { name: 'Building information' }),
    ).not.toBeInTheDocument();
  });

  it('displays a loading indicator whilst the data is loading', () => {
    render(<PriceHistoryTable {...defaultProps} isLoading />);

    const resultCountPill = screen.getByTestId('data-table');

    expect(resultCountPill).toHaveAttribute('aria-busy', 'true');
  });

  it('does not displays a loading indicator whilst the data is not loading', () => {
    render(<PriceHistoryTable {...defaultProps} isLoading={false} />);

    const resultCountPill = screen.getByTestId('data-table');

    expect(resultCountPill).toHaveAttribute('aria-busy', 'false');
  });

  it('displays an error message if the loading failed', () => {
    render(
      <PriceHistoryTable
        {...defaultProps}
        error={new Error('Something bad happened')}
      />,
    );

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('displays a no-results error for LAND type category classifieds', () => {
    render(
      <PriceHistoryTable
        {...defaultProps}
        pageClassified={{
          ...mockPageClassified,
          category: 'land',
        }}
      />,
    );

    expect(screen.getByText('Price history unavailable')).toBeInTheDocument();
  });

  it('displays no-results text when no results are found', () => {
    render(<PriceHistoryTable {...defaultProps} data={[]} />);

    expect(screen.getByText('No price history found')).toBeInTheDocument();
  });

  it('displays no-results text when no results can be filtered', () => {
    render(
      <PriceHistoryTable
        {...defaultProps}
        data={[mockClassified, mockClassified]}
        filters={[{ id: 'category', value: 'house' }]}
      />,
    );

    expect(
      screen.getByText('No data could be found with the given filters'),
    ).toBeInTheDocument();
  });

  describe('filtering', () => {
    it('filters by apartment', () => {
      render(
        <PriceHistoryTable
          {...defaultProps}
          data={[
            { ...mockClassified, category: 'apartment' },
            { ...mockClassified, category: 'house' },
          ]}
          filters={[{ id: 'category', value: 'apartment' }]}
        />,
      );

      expect(screen.getByText('apartment')).toBeInTheDocument();
      expect(screen.queryByText('house')).not.toBeInTheDocument();
    });

    it('displays a filtering help block only if there are filters active', () => {
      const { rerender } = render(
        <PriceHistoryTable {...defaultProps} filters={[]} />,
      );

      expect(screen.queryByText(/Filters applied/)).not.toBeInTheDocument();

      rerender(
        <PriceHistoryTable
          {...defaultProps}
          filters={[
            {
              id: 'category',
              value: 'apartment',
            },
          ]}
        />,
      );

      expect(screen.getByText(/Filters applied/)).toBeInTheDocument();
    });

    it('clicking "clear filters" triggers the callback', () => {
      const clearFilters = jest.fn();
      render(
        <PriceHistoryTable
          {...defaultProps}
          filters={[
            {
              id: 'category',
              value: 'apartment',
            },
          ]}
          clearFilters={clearFilters}
        />,
      );

      userEvent.click(screen.getByRole('link', { name: 'Clear filters' }));

      expect(clearFilters).toBeCalled();
    });
  });
});
