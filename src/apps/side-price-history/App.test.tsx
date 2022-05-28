import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

jest.mock('src/hooks/use-page-classified', () => () => ({
  data: {
    category: 'apartment',
    type: 'sell',
    price: 10000,
  },
  loading: false,
}));

const mocks: MockedResponse[] = [];
const wrapper: React.FC = ({ children }) => (
  <MockedProvider mocks={mocks} children={children} />
);

describe('App', () => {
  it('shows the result count in the toggle button', () => {
    render(<App />, { wrapper });

    expect(
      screen.getByRole('button', { name: 'View price history' }),
    ).toBeInTheDocument();
  });

  it('clicking on the toggle button opens the side panel and hides open button', () => {
    render(<App />, { wrapper });

    userEvent.click(screen.getByRole('button', { name: 'View price history' }));

    expect(
      screen.getByText('Price history for this estate'),
    ).toBeInTheDocument();
    expect(screen.queryByText('View price history')).not.toBeInTheDocument();
  });
});
