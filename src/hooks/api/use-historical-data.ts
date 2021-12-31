import { gql, useQuery } from '@apollo/client';

import { GetStatsResponse } from 'src/types/api';

const GET_STATS = gql`
  query ChromeExtension_GetState(
    $lat: Float!
    $lng: Float!
    $filter: PropertyFilter
  ) {
    point(lat: $lat, lng: $lng) {
      buildings {
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
  }
`;

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

interface GetStatsVars {
  lat: number;
  lng: number;
  filter: Record<string, Record<string, any>>;
}

/**
 * Retrieves the history and statistical data for a classified.
 */
export default function useHistoricalData(lat: number, lng: number) {
  const { data, loading, error } = useQuery<GetStatsResponse, GetStatsVars>(
    GET_STATS,
    {
      variables: {
        lat,
        lng,
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
      skip: !lat || !lng,
    },
  );

  return {
    data: {
      building:
        data && data.point.buildings.length > 0
          ? {
              id: data.point.buildings[0].id,
              bounds: data.point.buildings[0].bounds,
            }
          : null,
      properties: data?.point.buildings[0]?.properties.results || [],
    },
    loading,
    error,
  };
}
