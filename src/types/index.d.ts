export interface Classified {
  category: string;
  type: string;
  rent_type: string | null;
  price: number;
  calc_price_per_sqm: number | null;
  area: number | null;
  rooms: number | null;
  published_at: string | null;
}

export interface Building {
  id: number;
  bounds: string;
}

export interface CrawledClassified {
  source?: string;
  url?: string;
  category?: string;
  type?: string;
  rent_type?: string;
  lat?: number;
  lng?: number;

  price?: number;
  price_per_sqm?: number;

  location_district?: string;
  location_parish?: string;
  location_address?: string;
  location_village?: string;

  rooms?: number;
  area?: number;
  area_measurement?: string;
  floor?: number;
  max_floors?: number;

  content?: string;
  contact_phone?: string;
  contact_phone2?: string;
  contact_company?: string;
  building_project?: string;
  building_material?: string;

  images?: string[];

  foreign_id?: string;
  additional_data?: Record<string, string>;

  cadastre_number?: string;
  land_area?: number;
  land_area_measurement?: string;
  published_at?: string;
  views?: number;
}
