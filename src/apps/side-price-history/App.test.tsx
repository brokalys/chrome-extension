import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

const mocks: MockedResponse[] = [];
const wrapper: React.FC = ({ children }) => (
  <MockedProvider mocks={mocks} children={children} />
);

describe('App', () => {
  it('shows the result count in the toggle button', () => {
    render(<App />, { wrapper });

    expect(
      screen.getByRole('button', { name: 'View price history 0 results' }),
    ).toBeInTheDocument();
  });

  it('clicking on the toggle button opens the side panel and hides open button', () => {
    render(<App />, { wrapper });

    userEvent.click(
      screen.getByRole('button', { name: 'View price history 0 results' }),
    );

    expect(
      screen.getByText('Price history for this building'),
    ).toBeInTheDocument();
    expect(screen.queryByText('View price history')).not.toBeInTheDocument();
  });
});