import { gql, useMutation } from '@apollo/client';
import {
  Alert,
  Dialog,
  TextInputField,
  TextareaField,
  toaster,
} from 'evergreen-ui';
import React, { useState } from 'react';

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

export const SUBMIT_FEEDBACK = gql`
  mutation ChromeExtension_SubmitFeedback(
    $type: String!
    $message: String!
    $email: String
  ) {
    submitFeedback(type: $type, message: $message, email: $email)
  }
`;

export interface FeedbackModalProps {
  intent?: 'bug' | 'default';
  onSubmitComplete: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  intent = 'default',
  onSubmitComplete,
}) => {
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const [onSubmit, { loading, error }] = useMutation(SUBMIT_FEEDBACK);

  return (
    <Dialog
      isShown
      title={LABELS.TITLE[intent]}
      confirmLabel="Submit"
      onConfirm={() => {
        onSubmit({
          variables: { type: intent, message: description, email },
          onCompleted: () => {
            onSubmitComplete();
            toaster.success('Thank you for your report!');
          },
        });
      }}
      isConfirmLoading={loading}
    >
      {error && (
        <Alert
          intent="danger"
          title="Failed submitting the report. Please try again later."
          marginBottom={32}
        />
      )}

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

export default FeedbackModal;
