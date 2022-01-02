import Bugsnag from '@bugsnag/js';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FeedbackModal from './FeedbackModal';
import type { FeedbackModalProps } from './FeedbackModal';

jest.mock('@bugsnag/js');

const defaultProps: FeedbackModalProps = {
  intent: 'bug',
  onSubmitComplete: jest.fn(),
};

describe('FeedbackModal', () => {
  beforeEach(() => {
    (Bugsnag.notify as jest.Mock).mockImplementation((_err, _, callback) =>
      callback(),
    );
  });

  it('displays the description and email fields', () => {
    render(<FeedbackModal {...defaultProps} />);

    expect(
      screen.getByPlaceholderText('Problem description'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Your email')).toBeInTheDocument();
  });

  it('clicking the "Submit" button dispatches the bugsnag action and triggers the callback', () => {
    const onSubmitComplete = jest.fn();
    render(
      <FeedbackModal {...defaultProps} onSubmitComplete={onSubmitComplete} />,
    );

    userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmitComplete).toBeCalled();
    expect(Bugsnag.notify).toBeCalled();
  });
});
