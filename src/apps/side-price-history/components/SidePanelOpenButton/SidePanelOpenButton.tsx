import { Button, Pane, Pill, Spinner } from 'evergreen-ui';
import pluralize from 'pluralize';

import type { Classified } from 'src/types';

export interface SidePanelOpenButtonProps {
  isLoading: boolean;
  results: Classified[];
  onOpenClick: () => void;
}

const SidePanelOpenButton: React.FC<SidePanelOpenButtonProps> = ({
  isLoading,
  results,
  onOpenClick,
}) => {
  const resultCount = results.length;

  return (
    <Pane elevation={4} position="fixed" bottom={20} right={20}>
      <Button
        id="view-brokalys-price-history"
        height={56}
        appearance="primary"
        onClick={onOpenClick}
      >
        View price history
        <Pill
          display="inline-flex"
          margin={8}
          color="blue"
          isInteractive
          aria-live="polite"
          aria-busy={isLoading}
          data-testid="result-count-pill"
        >
          {isLoading ? (
            <Spinner size={16} />
          ) : (
            `${resultCount} ${pluralize('results', resultCount)}`
          )}
        </Pill>
      </Button>
    </Pane>
  );
};

export default SidePanelOpenButton;
