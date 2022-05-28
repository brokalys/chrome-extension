import { gql, useQuery } from '@apollo/client';

import apolloErrorHandler from 'src/lib/apollo-error-handler';
import { Building, CrawledClassified, Land } from 'src/types';
import {
  GetLandStatsResponse,
  GetStatsResponse,
  Property,
  VzdApartment,
  VzdHouse,
  VzdLand,
  VzdPremise,
} from 'src/types/api';

import useIdentifyEstate from './use-identify-estate';

const GET_STATS = gql`
  query ChromeExtension_GetState($id: Int!, $filter: PropertyFilter) {
    building(id: $id) {
      id
      cadastral_designation
      object_code
      land_cadastral_designation
      area
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
          floor_min: floor
          date: published_at
        }
      }
      vzd {
        apartments {
          date: sale_date
          price
          floor_min: space_group_lowest_floor
          floor_max: space_group_highest_floor
          area: apartment_total_area_m2
          rooms: room_count
        }
        premises {
          date: sale_date
          price
          floor_min: space_group_lowest_floor
          floor_max: space_group_highest_floor
          area: space_group_total_area_m2
          rooms: space_count_in_space_group
        }
        houses {
          date: sale_date
          price
          floor_min: building_overground_floors
          area: building_total_area_m2
        }
      }
    }
  }
`;

const GET_LAND_STATS = gql`
  query ChromeExtension_GetLandState($id: Int!, $filter: PropertyFilter) {
    land(id: $id) {
      id
      cadastral_designation
      object_code
      area
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
          floor_min: floor
          date: published_at
        }
      }
      vzd {
        land {
          date: sale_date
          price
          area: land_total_area_m2
        }
      }
    }
  }
`;

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

interface GetStatsVars {
  id: number;
  filter: Record<string, Record<string, any>>;
}

interface AsyncResponse<T> {
  data: T;
  loading: boolean;
  error: Error | undefined;
}

export type BlankResponse = {
  estate: null;
  properties: {
    results: Property[];
  };
  vzd: {};
};
export type LandResponse = {
  estate: Land;
  properties: {
    results: Property[];
  };
  vzd: {
    land: VzdLand[];
  };
};
export type BuildingResponse = {
  estate: Building;
  properties: {
    results: Property[];
  };
  vzd: {
    apartments: VzdApartment[];
    premises: VzdPremise[];
    houses: VzdHouse[];
  };
};
export type Response = LandResponse | BuildingResponse | BlankResponse;

/**
 * Retrieves the history and statistical data for a classified.
 */
export default function useHistoricalData(
  classified: CrawledClassified,
): AsyncResponse<Response> {
  const {
    data: estateData,
    loading: estateIdLoading,
    error: estateIdError,
  } = useIdentifyEstate(classified);

  const { data, loading, error } = useQuery<GetStatsResponse, GetStatsVars>(
    GET_STATS,
    {
      variables: {
        id: estateData?.id || 0,
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
      skip: !estateData || !estateData.id || estateData.type !== 'building',
      onError: apolloErrorHandler,
    },
  );

  const {
    data: landData,
    loading: landLoading,
    error: landError,
  } = useQuery<GetLandStatsResponse, GetStatsVars>(GET_LAND_STATS, {
    variables: {
      id: estateData?.id || 0,
      filter: {
        category: {
          in: ['land'],
        },
        type: {
          in: ['sell', 'rent', 'auction'],
        },
        price: {
          gt: 1,
        },
      },
    },
    skip: !estateData || !estateData.id || estateData.type !== 'land',
    onError: apolloErrorHandler,
  });

  if (landData?.land) {
    return {
      data: {
        estate: {
          ...landData.land,
          type: 'land' as const,
        },
        properties: landData?.land?.properties,
        vzd: landData?.land?.vzd,
      },
      loading: landLoading || loading,
      error: landError || error,
    };
  }

  if (data?.building) {
    return {
      data: {
        estate: {
          ...data.building,
          type: 'building' as const,
        },
        properties: {
          ...data.building?.properties,
          results: (data.building?.properties.results || []).map((row) => {
            if (['office'].includes(row.type)) {
              return {
                ...row,
                type: 'premise',
              };
            }
            return row;
          }),
        },
        vzd: data.building?.vzd,
      },
      loading: estateIdLoading || loading,
      error: estateIdError || error,
    };
  }

  return {
    data: {
      estate: null,
      properties: {
        results: [],
      },
      vzd: {},
    },
    loading: estateIdLoading || landLoading || loading,
    error: estateIdError || landError || error,
  };
}
