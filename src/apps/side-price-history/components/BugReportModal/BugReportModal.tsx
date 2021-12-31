import Bugsnag from '@bugsnag/js';
import { Dialog, TextInputField, TextareaField } from 'evergreen-ui';
import React, { useCallback, useState } from 'react';

export interface BugReportModalProps {
  onSubmitComplete: () => void;
}

const BugReportModal: React.FC<BugReportModalProps> = ({
  onSubmitComplete,
}) => {
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    Bugsnag.notify(
      new Error('new bug report'),
      (event) => {
        event.addMetadata('report', { description, email });
      },
      () => {
        setIsLoading(false);
        onSubmitComplete();
      },
    );
  }, [description, email, setIsLoading, onSubmitComplete]);

  return (
    <Dialog
      isShown
      title="Bug report"
      confirmLabel="Report"
      onConfirm={onSubmit}
      isConfirmLoading={isLoading}
    >
      <TextareaField
        label="Problem description"
        description="What problem are you experiencing? Is there something that could be improved?"
        hint="Describe in as much detail as possible."
        required
        placeholder="Problem description"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
      />

      <TextInputField
        label="Your email"
        description="So we would be able to each out to you for any additional information"
        placeholder="example@brokalys.com"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />
    </Dialog>
  );
};

export default BugReportModal;
