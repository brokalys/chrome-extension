import removeEmpty from 'clean-deep';
import { isEqual } from 'lodash';

import type { CrawledClassified } from 'src/types';

async function runCrawler(): Promise<CrawledClassified | undefined> {
  // Wait for page to load
  await new Promise((resolve) => {
    function waitForPageLoad() {
      if (document.querySelector('.object-price__main-price')) {
        resolve(true);
        return;
      }

      setTimeout(() => {
        waitForPageLoad();
      }, 1000);
    }

    waitForPageLoad();
  });

  function getElementText(selector: string): string {
    const element = document.querySelector(selector);

    if (!element) {
      return '';
    }

    return element.textContent || '';
  }

  function getCellText(labels: string[]) {
    try {
      const cells = Array.from(document.querySelectorAll('.full-specs td'));
      const locatedCellIndex = cells.findIndex(
        (row) => row.textContent && labels.includes(row.textContent),
      );

      if (locatedCellIndex > -1) {
        return cells[locatedCellIndex + 1].textContent || '';
      }
      return '';
    } catch (e) {
      return '';
    }
  }

  async function fetchFromApi() {
    try {
      const id = getCellText(['ID']);
      const response = await fetch(
        `https://m-api.city24.lv/realties/${id}?friendlyId=1`,
        {
          headers: {
            accept: 'application/json',
          },
          cache: 'force-cache',
        },
      );
      return response.json();
    } catch (e) {
      return {};
    }
  }

  let category = 'other';
  let type = 'other';
  const categoryTypeContainer = document.location.pathname.match(
    /real-estate\/(.*?)-for-(.*?)\//,
  )!;
  switch (categoryTypeContainer[1]) {
    case 'apartments':
    case 'houses':
    case 'commercials':
    case 'garages':
      category = categoryTypeContainer[1].substr(
        0,
        categoryTypeContainer[1].length - 1,
      );
      break;

    case 'land-lots':
      category = 'land';
      break;
  }
  switch (categoryTypeContainer[2]) {
    case 'sale':
      type = 'sell';
      break;
    case 'rent':
      type = 'rent';
      break;
  }

  const apiData = await fetchFromApi();

  const data = removeEmpty<CrawledClassified>(
    {
      source: 'city24.lv',
      url: document.location.origin + document.location.pathname,
      category,
      type,

      price: parseInt(
        getElementText('.object-price__main-price').replace(/[^0-9.]/g, ''),
        10,
      ),
      price_per_sqm: parseInt(
        getElementText('.object-price__m2-price').replace(/[^0-9.]/g, ''),
        10,
      ),

      lat: apiData?.latitude,
      lng: apiData?.longitude,

      location_district: getElementText(
        '.breadcrumbs__breadcrumb:nth-child(2)',
      ),
      location_parish: getElementText('.breadcrumbs__breadcrumb:nth-child(3)'),
      location_address: getElementText('.obj-detail__address'),

      rooms: parseInt(getCellText(['Istabas', 'Rooms', 'Комнат']), 10),

      area: parseInt(getCellText(['Platība', 'Size', 'Размер']), 10),
      area_measurement: getCellText(['Platība', 'Size', 'Размер']).match(/m/)
        ? 'm2'
        : undefined,

      floor: parseInt(getCellText(['Stāvs', 'Floor', 'Этаж']), 10),
      max_floors: parseInt(getCellText(['Stāvi', 'Total floors', 'Этажы']), 10),

      content: getElementText('.object-description__description:last-child'),

      building_project: getCellText(['Mājas sērija', 'House type', 'Тип дома']),
      building_material: getCellText([
        'Mājas tips',
        'Building material',
        'Материал дома',
      ]),

      images: Array.from(
        document.querySelectorAll('.image-gallery-thumbnail-inner img'),
      )
        .map((el) => el.getAttribute('src') || '')
        .filter((link) => !!link),

      foreign_id: getCellText(['ID']),

      cadastre_number: getCellText([
        'Kadastra nr',
        'Cadaster number',
        'Кадастровый номер',
      ]),

      land_area: parseInt(
        getCellText(['Zemes platība', 'Lot size', 'Размер грунта']),
        10,
      ),
      land_area_measurement: getCellText([
        'Zemes platība',
        'Lot size',
        'Размер грунта',
      ]).match(/m/)
        ? 'm2'
        : undefined,
    },
    { NaNValues: true },
  );

  if (isEqual(Object.keys(data), ['source', 'url', 'category', 'type'])) {
    return;
  }

  return data;
}

export default runCrawler;
