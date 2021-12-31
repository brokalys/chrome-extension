import {
  Button,
  Heading,
  Pane,
  SelectField,
  ShareIcon,
  SideSheet,
  Text,
  minorScale,
} from 'evergreen-ui';
import { useCallback, useMemo, useState } from 'react';

import type { Building, Classified, CrawledClassified } from 'src/types';

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

function SidePanel(props: SidePanelProps) {
  const { building, properties } = props.data;
  const [filters, setFilter, tableFilters] = useFilters();

  return (
    <SideSheet
      isShown={props.isOpen}
      onCloseComplete={props.onCloseClick}
      containerProps={{
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
      }}
      width={900}
    >
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
        <Pane padding={16} borderBottom="muted">
          <Pane float="right" display="flex" gap={minorScale(3)}>
            {props.pageClassified.lat &&
              props.pageClassified.lng &&
              (building ? (
                <Button
                  iconAfter={ShareIcon}
                  is="a"
                  href={`https://map.brokalys.com/#/${props.pageClassified.lat},${props.pageClassified.lng},18/building/${building.id}`}
                  target="_blank"
                >
                  View more data
                </Button>
              ) : (
                <Button
                  iconAfter={ShareIcon}
                  is="a"
                  href={`https://map.brokalys.com/#/${props.pageClassified.lat},${props.pageClassified.lng},18`}
                  target="_blank"
                >
                  View on Brokalys map
                </Button>
              ))}

            {/*<Button iconAfter={IssueIcon} intent="danger">
              Report a bug
            </Button>*/}
          </Pane>

          <Heading size={600}>Price history for this building</Heading>
        </Pane>
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
      </Pane>
      <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
        <PriceHistoryTable
          isLoading={props.isLoading}
          data={properties}
          filters={tableFilters}
          error={props.error}
        />
      </Pane>
    </SideSheet>
  );
}

export default SidePanel;
