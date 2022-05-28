export interface Property {
  id: number;
  category: string;
  type: string;
  rent_type: string | null;
  price: number;
  calc_price_per_sqm: number | null;
  rooms: number | null;
  area: number | null;
  floor_min: number | null;
  date: string | null;
}

export interface PropertySummary {
  count: number;
  price: {
    count: number | null;
    min: number | null;
    max: number | null;
    mean: number | null;
    median: number | null;
    mode: number | null;
    standardDev: number | null;
  };
}

export interface VzdApartment {
  id: number;
  date: string;
  price: number;
  floor_min: number | null;
  floor_max: number | null;
  area: number | null;
  rooms: number | null;
}

export interface VzdPremise {
  id: number;
  date: string;
  price: number;
  floor_min: number | null;
  floor_max: number | null;
  area: number | null;
  rooms: number | null;
}

export interface VzdHouse {
  id: number;
  date: string;
  price: number;
  floor_min: number | null;
  area: number | null;
  rooms: number | null;
}

export interface VzdLand {
  id: number;
  date: string;
  price: number;
  area: number | null;
}

export interface Building {
  id: number;
  cadastral_designation: string;
  object_code: string;
  land_cadastral_designation: string;
  area: number;
  properties: {
    results: Property[];
    summary: PropertySummary;
  };
  vzd: {
    apartments: VzdApartment[];
    premises: VzdPremise[];
    houses: VzdHouse[];
  };
}

export interface Land {
  id: number;
  cadastral_designation: string;
  object_code: string;
  area: number;
  properties: {
    results: Property[];
    summary: PropertySummary;
  };
  vzd: {
    land: VzdLand[];
  };
}

export interface GetStatsResponse {
  building: Building;
}

export interface GetLandStatsResponse {
  land: Land;
}
