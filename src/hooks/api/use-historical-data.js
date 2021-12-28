import { gql, useQuery } from '@apollo/client';

const GET_STATS = gql`
  query ChromeExtension_GetState(
    $lat: Float!
    $lng: Float!
    $filter: PropertyFilter
  ) {
    point(lat: $lat, lng: $lng) {
      buildings {
        id
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

/**
 * Retrieves the history and statistical data for a classified.
 */
export default function useHistoricalData(lat, lng) {
  const { data, loading, error } = useQuery(GET_STATS, {
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
  });

  return {
    data: {
      building: data?.point?.buildings?.[0] || {},
      properties: data?.point?.buildings?.[0]?.properties.results || [],
    },
    loading,
    error,
  };
}
