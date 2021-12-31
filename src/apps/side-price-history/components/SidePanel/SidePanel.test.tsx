import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockClassified from 'src/__test__/mock-classified';
import mockPageClassified from 'src/__test__/mock-page-classified';

import SidePanel from './SidePanel';
import type { SidePanelProps } from './SidePanel';

const defaultProps: SidePanelProps = {
  isOpen: true,
  isLoading: false,
  data: {
    building: null,
    properties: [],
  },
  error: undefined,
  pageClassified: mockPageClassified,
  onCloseClick: jest.fn(),
};

describe('SidePanel', () => {
  it('displays the results table', () => {
    render(<SidePanel {...defaultProps} />);

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('displays a map.brokalys.com link button', () => {
    render(
      <SidePanel
        {...defaultProps}
        data={{
          ...defaultProps.data,
          building: {
            id: 123,
            bounds: '',
          },
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
      'https://map.brokalys.com/#/56.241,24.98134,18/building/123',
    );
  });

  it('does not display a map.brokalys.com link button when lat is not set', () => {
    render(
      <SidePanel
        {...defaultProps}
        data={{
          ...defaultProps.data,
          building: {
            id: 123,
            bounds: '',
          },
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
        data={{
          ...defaultProps.data,
          properties: [
            { ...mockClassified, category: 'apartment' },
            { ...mockClassified, category: 'house' },
          ],
        }}
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
        data={{
          ...defaultProps.data,
          properties: [
            { ...mockClassified, type: 'sell' },
            { ...mockClassified, type: 'rent' },
          ],
        }}
      />,
    );
    const table = screen.getByTestId('data-table');

    userEvent.selectOptions(screen.getByLabelText('Type'), ['rent']);

    expect(within(table).getByText('rent')).toBeInTheDocument();
    expect(within(table).queryByText('sell')).not.toBeInTheDocument();
  });

  it('does not show a rent_type toggle by default', () => {
    render(<SidePanel {...defaultProps} />);

    expect(screen.queryByLabelText('Rent type')).not.toBeInTheDocument();
  });

  it('resets the rent_type selection when type is not rent', () => {
    render(
      <SidePanel
        {...defaultProps}
        data={{
          ...defaultProps.data,
          properties: [
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
          ],
        }}
      />,
    );
    const table = screen.getByTestId('data-table');

    userEvent.selectOptions(screen.getByLabelText('Type'), ['rent']);
    userEvent.selectOptions(screen.getByLabelText('Rent type'), ['weekly']);
    userEvent.selectOptions(screen.getByLabelText('Type'), ['All types']);

    expect(within(table).getByText('100 €/m')).toBeInTheDocument();
    expect(within(table).getByText('100 €/w')).toBeInTheDocument();
  });
});
