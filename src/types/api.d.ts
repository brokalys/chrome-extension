export interface Property {
  id: number;
  category: string;
  type: string;
  rent_type: string | null;
  price: number;
  calc_price_per_sqm: number | null;
  rooms: number | null;
  area: number | null;
  floor: number | null;
  published_at: string | null;
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

export interface Building {
  id: number;
  bounds: string;
  properties: {
    results: Property[];
    summary: PropertySummary;
  };
}

export interface GetStatsResponse {
  building: Building;
}
