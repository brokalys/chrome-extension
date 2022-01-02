import Bugsnag from '@bugsnag/js';
import { Dialog, TextInputField, TextareaField, toaster } from 'evergreen-ui';
import React, { useCallback, useState } from 'react';

const LABELS = {
  TITLE: {
    bug: 'Bug report',
    default: 'Feedback',
  },
  DESCRIPTION_LABEL: {
    bug: 'Problem description',
    default: 'Feature/suggestion description',
  },
  DESCRIPTION_DESCRIPTION: {
    bug: 'What problem are you experiencing? Is there something that could be improved?',
    default: undefined,
  },
};

export interface BugReportModalProps {
  intent?: 'bug' | 'default';
  onSubmitComplete: () => void;
}

const BugReportModal: React.FC<BugReportModalProps> = ({
  intent = 'default',
  onSubmitComplete,
}) => {
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    Bugsnag.notify(
      new Error('new feedback submission'),
      (event) => {
        event.addMetadata('report', { intent, description, email });
      },
      () => {
        setIsLoading(false);
        onSubmitComplete();
        toaster.success('Thank you for your report!');
      },
    );
  }, [intent, description, email, setIsLoading, onSubmitComplete]);

  return (
    <Dialog
      isShown
      title={LABELS.TITLE[intent]}
      confirmLabel="Submit"
      onConfirm={onSubmit}
      isConfirmLoading={isLoading}
    >
      <TextareaField
        label={LABELS.DESCRIPTION_LABEL[intent]}
        description={LABELS.DESCRIPTION_DESCRIPTION[intent]}
        hint="Describe in as much detail as possible."
        required
        placeholder={LABELS.DESCRIPTION_LABEL[intent]}
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
