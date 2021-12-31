import Bugsnag from '@bugsnag/js';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BugReportModal from './BugReportModal';
import type { BugReportModalProps } from './BugReportModal';

jest.mock('@bugsnag/js');

const defaultProps: BugReportModalProps = {
  onSubmitComplete: jest.fn(),
};

describe('BugReportModal', () => {
  beforeEach(() => {
    (Bugsnag.notify as jest.Mock).mockImplementation((_err, _, callback) =>
      callback(),
    );
  });

  it('displays the description and email fields', () => {
    render(<BugReportModal {...defaultProps} />);

    expect(
      screen.getByPlaceholderText('Problem description'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Your email')).toBeInTheDocument();
  });

  it('clicking the "report" button dispatches the bugsnag action and triggers the callback', () => {
    const onSubmitComplete = jest.fn();
    render(
      <BugReportModal {...defaultProps} onSubmitComplete={onSubmitComplete} />,
    );

    userEvent.click(screen.getByRole('button', { name: 'Report' }));

    expect(onSubmitComplete).toBeCalled();
    expect(Bugsnag.notify).toBeCalled();
  });
});
