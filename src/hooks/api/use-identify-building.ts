import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';

import apolloErrorHandler from 'src/lib/apollo-error-handler';
import { CrawledClassified } from 'src/types';

const IDENTIFY_BUILDING = gql`
  mutation ChromeExtension_CalculateBuildingId(
    $source: String
    $url: String
    $category: String
    $type: String
    $rent_type: String
    $lat: Float
    $lng: Float
    $price: Float
    $price_per_sqm: Float
    $location_district: String
    $location_parish: String
    $location_address: String
    $location_village: String
    $rooms: Int
    $area: Int
    $area_measurement: String
    $floor: Int
    $max_floors: Int
    $content: String
    $building_project: String
    $building_material: String
    $images: [String]
    $foreign_id: String
    $additional_data: String
    $cadastre_number: String
    $land_area: Float
    $land_area_measurement: String
    $date: String
    $views: Int
  ) {
    calculateBuildingId(
      source: $source
      url: $url

      category: $category
      type: $type
      rent_type: $rent_type

      lat: $lat
      lng: $lng

      price: $price
      price_per_sqm: $price_per_sqm

      location_district: $location_district
      location_parish: $location_parish
      location_address: $location_address
      location_village: $location_village

      rooms: $rooms
      area: $area
      area_measurement: $area_measurement
      floor: $floor
      max_floors: $max_floors

      content: $content
      building_project: $building_project
      building_material: $building_material
      images: $images

      foreign_id: $foreign_id
      additional_data: $additional_data
      cadastre_number: $cadastre_number

      land_area: $land_area
      land_area_measurement: $land_area_measurement
      published_at: $date
      views: $views
    )
  }
`;

interface CalculateBuildingIdRequest
  extends Omit<CrawledClassified, 'additional_data'> {
  additional_data?: string;
}
interface CalculateBuildingIdResponse {
  calculateBuildingId: number | null;
}

export default function useIdentifyBuilding(variables: CrawledClassified) {
  const [mutateFunction, { data, loading, error }] = useMutation<
    CalculateBuildingIdResponse,
    CalculateBuildingIdRequest
  >(IDENTIFY_BUILDING);

  useEffect(() => {
    mutateFunction({
      variables: {
        ...variables,
        additional_data: JSON.stringify(variables.additional_data),
      },
      onError: apolloErrorHandler,
    });
  }, [variables, mutateFunction]);

  return {
    data: data?.calculateBuildingId,
    loading,
    error,
  };
}
