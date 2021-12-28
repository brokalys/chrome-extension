import { gql, useQuery } from '@apollo/client';

const GET_STATS = gql`
  query ChromeExtension_GetState($lat: Float!, $lng: Float!) {
    point(lat: $lat, lng: $lng) {
      buildings {
        id
        properties {
          results {
            price
            price_per_sqm
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
    },
    skip: !lat || !lng,
  });

  return {
    data: data ? data.point.buildings[0]?.properties.results : [],
    loading,
    error,
  };
}
