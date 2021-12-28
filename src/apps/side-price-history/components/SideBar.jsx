import {
  Button,
  SideSheet,
  Pane,
  Select,
  Text,
  Heading,
  ShareIcon,
  IssueIcon,
  minorScale,
} from 'evergreen-ui';
import React from 'react';

import PriceHistoryTable from './PriceHistoryTable';

function SideBar(props) {
  const { building, properties } = props.data;

  // @todo: simplify filters
  const [filters, setFilters] = React.useState({});
  const setFilter = React.useCallback(
    (id, value) => {
      setFilters((state) => ({ ...state, [id]: value }));
    },
    [setFilters],
  );

  const tableFilters = React.useMemo(
    () =>
      Object.entries(filters)
        .map(([id, value]) => ({ id, value }))
        .filter(({ value }) => !!value)
        .filter(({ id }) => id !== 'rent_type' || filters.type === 'rent'),
    [filters],
  );

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
            {building.id ? (
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
            )}
            <Button iconAfter={IssueIcon} intent="danger">
              Report a bug
            </Button>
          </Pane>

          <Heading size={600}>Price history for this building</Heading>
        </Pane>
        <Pane
          display="flex"
          alignItems="center"
          padding={8}
          gap={minorScale(3)}
        >
          <Text marginLeft={minorScale(3)}>Filters:</Text>
          <Pane>
            <Select
              value={filters.category}
              onChange={(event) => setFilter('category', event.target.value)}
            >
              <option value="">All categories</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="office">Office</option>
            </Select>
          </Pane>

          <Pane>
            <Select
              value={filters.type}
              onChange={(event) => setFilter('type', event.target.value)}
            >
              <option value="">All types</option>
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
              <option value="auction">Auction</option>
            </Select>
          </Pane>

          {filters.type === 'rent' && (
            <Pane>
              <Select
                value={filters.rent_type}
                onChange={(event) => setFilter('rent_type', event.target.value)}
              >
                <option value="">All rent types</option>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </Select>
            </Pane>
          )}
        </Pane>
      </Pane>
      <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
        <PriceHistoryTable
          isLoading={props.isLoading}
          data={properties}
          filters={tableFilters}
        />
      </Pane>
    </SideSheet>
  );
}

export default SideBar;
