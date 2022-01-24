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

export interface Building {
  id: number;
  bounds: string;
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

export interface GetStatsResponse {
  building: Building;
}
