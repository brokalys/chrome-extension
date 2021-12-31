import { Button, Pane, Pill, Spinner } from 'evergreen-ui';
import pluralize from 'pluralize';

import type { Classified } from 'src/types';

export interface SidePanelOpenButtonProps {
  isLoading: boolean;
  results: Classified[];
  onOpenClick: () => void;
}

function SidePanelOpenButton(props: SidePanelOpenButtonProps) {
  const resultCount = props.results.length;

  return (
    <Pane elevation={4} position="fixed" bottom={20} right={20}>
      <Button height={56} appearance="primary" onClick={props.onOpenClick}>
        View price history
        <Pill
          display="inline-flex"
          margin={8}
          color="blue"
          isInteractive
          aria-live="polite"
          aria-busy={props.isLoading}
          data-testid="result-count-pill"
        >
          {props.isLoading ? (
            <Spinner size={16} />
          ) : (
            `${resultCount} ${pluralize('results', resultCount)}`
          )}
        </Pill>
      </Button>
    </Pane>
  );
}

export default SidePanelOpenButton;
