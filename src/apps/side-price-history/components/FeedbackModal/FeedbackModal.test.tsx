import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FeedbackModal, { SUBMIT_FEEDBACK } from './FeedbackModal';
import type { FeedbackModalProps } from './FeedbackModal';

jest.mock('@bugsnag/js');

const defaultProps: FeedbackModalProps = {
  intent: 'bug',
  onSubmitComplete: jest.fn(),
  onClose: jest.fn(),
};

const mocks: MockedResponse[] = [
  {
    request: {
      query: SUBMIT_FEEDBACK,
      variables: {
        type: 'bug',
        message: 'My Problem!',
        email: '',
      },
    },
    result: { data: { submitFeedback: true } },
  },
];
const wrapper: React.FC = ({ children }) => (
  <MockedProvider mocks={mocks} children={children} />
);

describe('FeedbackModal', () => {
  it('displays the description and email fields', () => {
    render(<FeedbackModal {...defaultProps} />, { wrapper });

    expect(
      screen.getByPlaceholderText('Problem description'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Your email')).toBeInTheDocument();
  });

  it('clicking the "Submit" button dispatches the bugsnag action and triggers the callback', async () => {
    const onSubmitComplete = jest.fn();
    render(
      <FeedbackModal {...defaultProps} onSubmitComplete={onSubmitComplete} />,
      { wrapper },
    );

    userEvent.type(
      screen.getByPlaceholderText('Problem description'),
      'My Problem!',
    );
    userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onSubmitComplete).toBeCalled());
  });
});
