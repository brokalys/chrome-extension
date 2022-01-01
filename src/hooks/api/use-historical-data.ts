import { gql, useQuery } from '@apollo/client';

import apolloErrorHandler from 'src/lib/apollo-error-handler';
import { CrawledClassified } from 'src/types';
import { GetStatsResponse } from 'src/types/api';

import useIdentifyBuilding from './use-identify-building';

const GET_STATS = gql`
  query ChromeExtension_GetState($buildingId: Int!, $filter: PropertyFilter) {
    building(id: $buildingId) {
      id
      bounds
      properties(filter: $filter) {
        results {
          id
          category
          type
          rent_type
          price
          calc_price_per_sqm
          area
          rooms
          published_at
        }
      }
    }
  }
`;

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

interface GetStatsVars {
  buildingId: number;
  filter: Record<string, Record<string, any>>;
}

/**
 * Retrieves the history and statistical data for a classified.
 */
export default function useHistoricalData(classified: CrawledClassified) {
  const {
    data: buildingId,
    loading: buildingIdLoading,
    error: buildingIdError,
  } = useIdentifyBuilding(classified);

  const { data, loading, error } = useQuery<GetStatsResponse, GetStatsVars>(
    GET_STATS,
    {
      variables: {
        buildingId: buildingId!,
        filter: {
          category: {
            in: ['apartment', 'house', 'office'],
          },
          type: {
            in: ['sell', 'rent', 'auction'],
          },
          price: {
            gt: 1,
          },
        },
      },
      skip: !buildingId,
      onError: apolloErrorHandler,
    },
  );

  return {
    data: {
      building:
        data && data.building
          ? {
              id: data.building.id,
              bounds: data.building.bounds,
            }
          : null,
      properties: data?.building?.properties.results || [],
    },
    loading: buildingIdLoading || loading,
    error: buildingIdError || error,
  };
}
