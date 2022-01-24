import { RESULT_CLASSIFIED } from 'src/constants';
import type { Classified } from 'src/types';

const mockClassified: Classified = {
  source: RESULT_CLASSIFIED,
  category: 'apartment',
  type: 'rent',
  rent_type: 'monthly',
  price: 120,
  calc_price_per_sqm: 12,
  area: 10,
  rooms: 1,
  floor_min: 4,
  date: '2021-11-02T08:00:00.000Z',
};

export default mockClassified;
