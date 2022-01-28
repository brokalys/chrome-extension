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
  Tooltip,
  minorScale,
} from 'evergreen-ui';
import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use-storage';

import { RESULT_CLASSIFIED, RESULT_REAL_SALE } from 'src/constants';
import type { Building, Classified, CrawledClassified } from 'src/types';

import FeedbackModal from '../FeedbackModal';
import PriceHistoryTable from '../PriceHistoryTable';
import styles from './SidePanel.module.scss';

function useFilters() {
  const [filters, setFilters] = useLocalStorage<Record<string, string>>(
    'brokalys_priceHistoryTableFilters',
    {},
  );
  const setFilter = (id: string, value: string) => {
    const newFilters = {
      ...filters,
      [id]: value,
    };
    setFilters(newFilters);
  };

  const tableFilters = useMemo(
    () =>
      Object.entries(filters)
        .map(([id, value]) => ({ id, value }))
        .filter(({ value }) => !!value)
        .filter(
          ({ id }) =>
            !(
              filters.source === RESULT_REAL_SALE &&
              ['type', 'rent_type'].includes(id)
            ),
        )
        .filter(({ id }) => id !== 'rent_type' || filters.type === 'rent'),
    [filters],
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  return [filters, setFilter, clearFilters, tableFilters] as const;
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
  building: Building | null;
  results: Classified[];
  error: Error | undefined;
  pageClassified: CrawledClassified;
  onCloseClick: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  isLoading,
  building,
  results,
  error,
  pageClassified,
  onCloseClick,
}) => {
  const [filters, setFilter, clearFilters, tableFilters] = useFilters();
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
        <FeedbackModal
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
            paddingTop={2}
            gap={minorScale(3)}
            className={styles.filters}
          >
            <Text marginLeft={minorScale(3)} marginTop={minorScale(1)}>
              Filters:
            </Text>

            <SelectField
              label="Data source"
              value={filters.source || ''}
              onChange={(event) => setFilter('source', event.target.value)}
              marginBottom={0}
              className={filters.source && styles.activeFilter}
            >
              <option value="">All data sources</option>
              <option value={RESULT_REAL_SALE}>Real data</option>
              <option value={RESULT_CLASSIFIED}>Classifieds</option>
            </SelectField>

            <SelectField
              label="Category"
              value={filters.category || ''}
              onChange={(event) => setFilter('category', event.target.value)}
              marginBottom={0}
              className={filters.category && styles.activeFilter}
            >
              <option value="">All categories</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="premise">Premise</option>
            </SelectField>

            {filters.source !== RESULT_REAL_SALE && (
              <>
                <SelectField
                  label="Type"
                  value={filters.type || ''}
                  onChange={(event) => setFilter('type', event.target.value)}
                  marginBottom={0}
                  className={filters.type && styles.activeFilter}
                >
                  <option value="">All types</option>
                  <option value="sell">Sell</option>
                  <option value="rent">Rent</option>
                  <option value="auction">Auction</option>
                </SelectField>

                {filters.type === 'rent' && (
                  <SelectField
                    label="Rent type"
                    value={filters.rent_type || ''}
                    onChange={(event) =>
                      setFilter('rent_type', event.target.value)
                    }
                    marginBottom={0}
                    className={filters.rent_type && styles.activeFilter}
                  >
                    <option value="">All rent types</option>
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </SelectField>
                )}
              </>
            )}
          </Pane>

          <Pane display="flex" gap={12} padding={8} paddingRight={16}>
            <Tooltip content="Receive email notifications about new classifieds matching your filters.">
              <Button
                iconAfter={ShareIcon}
                is="a"
                href={`https://pinger.brokalys.com/#/?ref=extension`}
                target="_blank"
              >
                Set-up a PINGER
              </Button>
            </Tooltip>

            {pageClassified.lat &&
              pageClassified.lng &&
              (building ? (
                <Button
                  iconAfter={ShareIcon}
                  is="a"
                  href={`https://brokalys.com/#/${pageClassified.lat},${pageClassified.lng},18/building/${building.id}?ref=extension`}
                  target="_blank"
                >
                  View more data
                </Button>
              ) : (
                <Button
                  iconAfter={ShareIcon}
                  is="a"
                  href={`https://brokalys.com/#/${pageClassified.lat},${pageClassified.lng},18?ref=extension`}
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
          data={results}
          building={building}
          pageClassified={pageClassified}
          filters={tableFilters}
          clearFilters={clearFilters}
          error={error}
        />
      </Pane>
    </SideSheet>
  );
};

export default SidePanel;
