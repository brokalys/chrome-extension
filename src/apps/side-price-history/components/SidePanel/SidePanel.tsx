import {
  Button,
  Heading,
  IssueIcon,
  LightningIcon,
  Pane,
  SelectField,
  ShareIcon,
  SideSheet,
  Text,
  minorScale,
} from 'evergreen-ui';
import { useCallback, useMemo, useState } from 'react';

import type { Building, Classified, CrawledClassified } from 'src/types';

import BugReportModal from '../BugReportModal';
import PriceHistoryTable from '../PriceHistoryTable';
import styles from './SidePanel.module.scss';

function useFilters() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const setFilter = useCallback(
    (id, value) => {
      setFilters((state) => ({ ...state, [id]: value }));
    },
    [setFilters],
  );

  const tableFilters = useMemo(
    () =>
      Object.entries(filters)
        .map(([id, value]) => ({ id, value }))
        .filter(({ value }) => !!value)
        .filter(({ id }) => id !== 'rent_type' || filters.type === 'rent'),
    [filters],
  );

  return [filters, setFilter, tableFilters] as const;
}

function useFeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<'bug' | 'default'>('default');

  const openFeedbackModal = useCallback(
    (intent: 'bug' | 'default' = 'default') => {
      setIntent(intent);
      setIsOpen(true);
    },
    [setIsOpen, setIntent],
  );
  const closeFeedbackModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return [
    {
      intent,
      isOpen,
    },
    openFeedbackModal,
    closeFeedbackModal,
  ] as const;
}

export interface SidePanelProps {
  isOpen: boolean;
  isLoading: boolean;
  data: {
    building: Building | null;
    properties: Classified[];
  };
  error: Error | undefined;
  pageClassified: CrawledClassified;
  onCloseClick: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  isLoading,
  data: { building, properties },
  error,
  pageClassified,
  onCloseClick,
}) => {
  const [filters, setFilter, tableFilters] = useFilters();
  const [
    { isOpen: isOpenFeedbackModal, intent: feedbackModalIntent },
    openFeedbackModal,
    closeFeedbackModal,
  ] = useFeedbackModal();

  return (
    <SideSheet
      isShown={isOpen}
      onCloseComplete={onCloseClick}
      containerProps={{
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
      }}
      width={900}
    >
      {isOpenFeedbackModal && (
        <BugReportModal
          intent={feedbackModalIntent}
          onSubmitComplete={closeFeedbackModal}
        />
      )}

      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
        <Pane padding={16} borderBottom="muted">
          <Pane float="right" display="flex" gap={minorScale(3)}>
            <Button
              iconAfter={LightningIcon}
              appearance="primary"
              onClick={() => openFeedbackModal()}
            >
              Suggest a feature
            </Button>
            <Button
              iconAfter={IssueIcon}
              intent="danger"
              onClick={() => openFeedbackModal('bug')}
            >
              Report a bug
            </Button>
          </Pane>

          <Heading size={600}>Price history for this building</Heading>
        </Pane>

        <Pane display="flex" alignItems="center" justifyContent="space-between">
          <Pane
            display="flex"
            alignItems="center"
            padding={8}
            gap={minorScale(3)}
            className={styles.filters}
          >
            <Text marginLeft={minorScale(3)}>Filters:</Text>

            <SelectField
              label="Category"
              value={filters.category}
              onChange={(event) => setFilter('category', event.target.value)}
              marginBottom={0}
            >
              <option value="">All categories</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="office">Office</option>
            </SelectField>

            <SelectField
              label="Type"
              value={filters.type}
              onChange={(event) => setFilter('type', event.target.value)}
              marginBottom={0}
            >
              <option value="">All types</option>
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
              <option value="auction">Auction</option>
            </SelectField>

            {filters.type === 'rent' && (
              <SelectField
                label="Rent type"
                value={filters.rent_type}
                onChange={(event) => setFilter('rent_type', event.target.value)}
                marginBottom={0}
              >
                <option value="">All rent types</option>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </SelectField>
            )}
          </Pane>

          <Pane padding={8} paddingRight={16}>
            {pageClassified.lat &&
              pageClassified.lng &&
              (building ? (
                <Button
                  iconAfter={ShareIcon}
                  is="a"
                  href={`https://map.brokalys.com/#/${pageClassified.lat},${pageClassified.lng},18/building/${building.id}`}
                  target="_blank"
                >
                  View more data
                </Button>
              ) : (
                <Button
                  iconAfter={ShareIcon}
                  is="a"
                  href={`https://map.brokalys.com/#/${pageClassified.lat},${pageClassified.lng},18`}
                  target="_blank"
                >
                  View on Brokalys map
                </Button>
              ))}
          </Pane>
        </Pane>
      </Pane>

      <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
        <PriceHistoryTable
          isLoading={isLoading}
          data={properties}
          pageClassified={pageClassified}
          filters={tableFilters}
          error={error}
        />
      </Pane>
    </SideSheet>
  );
};

export default SidePanel;
