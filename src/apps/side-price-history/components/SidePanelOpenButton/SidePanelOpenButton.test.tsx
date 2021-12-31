import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockClassified from 'src/__test__/mock-classified';

import SidePanelOpenButton from './SidePanelOpenButton';
import type { SidePanelOpenButtonProps } from './SidePanelOpenButton';

const defaultProps: SidePanelOpenButtonProps = {
  isLoading: false,
  results: [],
  onOpenClick: jest.fn(),
};

describe('SidePanelOpenButton', () => {
  it('shows the result count', () => {
    render(
      <SidePanelOpenButton
        {...defaultProps}
        results={[mockClassified, mockClassified]}
      />,
    );

    expect(screen.queryByText('2 results')).toBeInTheDocument();
  });

  it('shows the result count with singular language', () => {
    render(
      <SidePanelOpenButton {...defaultProps} results={[mockClassified]} />,
    );

    expect(screen.queryByText('1 result')).toBeInTheDocument();
  });

  it('shows a loading indicator when the results are still loading', () => {
    render(<SidePanelOpenButton {...defaultProps} isLoading />);

    const resultCountPill = screen.getByTestId('result-count-pill');

    expect(resultCountPill).toHaveAttribute('aria-busy', 'true');
  });

  it('does not show a loading indicator when the data is not loading', () => {
    render(<SidePanelOpenButton {...defaultProps} isLoading={false} />);

    const resultCountPill = screen.getByTestId('result-count-pill');

    expect(resultCountPill).toHaveAttribute('aria-busy', 'false');
  });

  it('clicking the button triggers a callback', () => {
    const onOpenClick = jest.fn();
    render(<SidePanelOpenButton {...defaultProps} onOpenClick={onOpenClick} />);

    userEvent.click(
      screen.getByRole('button', { name: 'View price history 0 results' }),
    );

    expect(onOpenClick).toBeCalled();
  });
});
