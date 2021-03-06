import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockClassified from 'src/__test__/mock-classified';
import mockPageClassified from 'src/__test__/mock-page-classified';

import SidePanel from './SidePanel';
import type { SidePanelProps } from './SidePanel';

const defaultProps: SidePanelProps = {
  isOpen: true,
  isLoading: false,
  estate: null,
  results: [],
  error: undefined,
  pageClassified: mockPageClassified,
  onCloseClick: jest.fn(),
};

const mocks: MockedResponse[] = [];
const wrapper: React.FC = ({ children }) => (
  <MockedProvider mocks={mocks} children={children} />
);

describe('SidePanel', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('displays the results table', () => {
    render(<SidePanel {...defaultProps} />);

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('displays a brokalys.com link button', () => {
    render(
      <SidePanel
        {...defaultProps}
        estate={{
          id: 123,
          type: 'building',
          cadastral_designation: '98940060012001',
          object_code: '5201011110',
          land_cadastral_designation: '98940060055',
          area: 204.71308898926,
        }}
        pageClassified={{
          ...mockPageClassified,
          lat: 56.241,
          lng: 24.98134,
        }}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'View more data' }),
    ).toHaveAttribute(
      'href',
      'https://brokalys.com/#/56.241,24.98134,18/estate/building/123?ref=extension',
    );
  });

  it('displays a pinger.brokalys.com link button', () => {
    render(<SidePanel {...defaultProps} />);

    expect(
      screen.getByRole('link', { name: 'Set-up a PINGER' }),
    ).toHaveAttribute('href', 'https://pinger.brokalys.com/#/?ref=extension');
  });

  it('does not display a brokalys.com link button when lat is not set', () => {
    render(
      <SidePanel
        {...defaultProps}
        estate={{
          id: 123,
          type: 'building',
          cadastral_designation: '98940060012001',
          object_code: '5201011110',
          land_cadastral_designation: '98940060055',
          area: 204.71308898926,
        }}
        pageClassified={{
          ...mockPageClassified,
          lat: undefined,
          lng: 24.98134,
        }}
      />,
    );

    expect(
      screen.queryByRole('link', { name: 'View more data' }),
    ).not.toBeInTheDocument();
  });

  it('filters the table by category', () => {
    render(
      <SidePanel
        {...defaultProps}
        results={[
          { ...mockClassified, category: 'apartment' },
          { ...mockClassified, category: 'house' },
        ]}
      />,
    );
    const table = screen.getByTestId('data-table');

    userEvent.selectOptions(screen.getByLabelText('Category'), ['apartment']);

    expect(within(table).getByText('apartment')).toBeInTheDocument();
    expect(within(table).queryByText('house')).not.toBeInTheDocument();
  });

  it('filters the table by type', () => {
    render(
      <SidePanel
        {...defaultProps}
        results={[
          { ...mockClassified, type: 'sell' },
          { ...mockClassified, type: 'rent' },
        ]}
      />,
    );
    const table = screen.getByTestId('data-table');

    userEvent.selectOptions(screen.getByLabelText('Type'), ['rent']);

    expect(within(table).getByText('rent')).toBeInTheDocument();
    expect(within(table).queryByText('sell')).not.toBeInTheDocument();
  });

  it('recovers filters from localStorage', () => {
    localStorage.setItem(
      'brokalys_priceHistoryTableFilters',
      '{"type":"sell"}',
    );

    render(<SidePanel {...defaultProps} />);

    expect(screen.getByDisplayValue('Sell')).toBeInTheDocument();
  });

  it('does not show a rent_type toggle by default', () => {
    render(<SidePanel {...defaultProps} />);

    expect(screen.queryByLabelText('Rent type')).not.toBeInTheDocument();
  });

  it('resets the rent_type selection when type is not rent', () => {
    render(
      <SidePanel
        {...defaultProps}
        results={[
          {
            ...mockClassified,
            price: 100,
            type: 'rent',
            rent_type: 'monthly',
          },
          {
            ...mockClassified,
            price: 100,
            type: 'rent',
            rent_type: 'weekly',
          },
        ]}
      />,
    );
    const table = screen.getByTestId('data-table');

    userEvent.selectOptions(screen.getByLabelText('Type'), ['rent']);
    userEvent.selectOptions(screen.getByLabelText('Rent type'), ['weekly']);
    userEvent.selectOptions(screen.getByLabelText('Type'), ['All types']);

    expect(within(table).getByText('100 ???/m')).toBeInTheDocument();
    expect(within(table).getByText('100 ???/w')).toBeInTheDocument();
  });

  it('clicking on the bug report button opens up the bug report modal', () => {
    render(<SidePanel {...defaultProps} />, { wrapper });

    userEvent.click(
      screen.getByRole('button', {
        name: 'Report a bug',
      }),
    );

    expect(screen.getByText('Bug report')).toBeInTheDocument();
  });

  it('clicking on the feedback button opens up the feedback modal', () => {
    render(<SidePanel {...defaultProps} />, { wrapper });

    userEvent.click(
      screen.getByRole('button', {
        name: 'Suggest a feature',
      }),
    );

    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });
});
