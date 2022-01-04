import removeEmpty from 'clean-deep';
import { isEqual } from 'lodash';

import type { CrawledClassified } from 'src/types';

function runCrawler(): CrawledClassified | undefined {
  function getElementText(selector: string): string {
    const element = document.querySelector(selector);

    if (!element) {
      return '';
    }

    return element.textContent || '';
  }

  function getCellText(cellLabels: string[]) {}

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
      type = 'sale';
      break;
    case 'rent':
      type = 'rent';
      break;
  }

  const data = removeEmpty<CrawledClassified>(
    {
      source: 'city24.lv',
      url: document.location.origin + document.location.pathname,
      category,
      type,

      content: getElementText('.object-description__description:last-child'),

      rooms: (() => {
        try {
          if (getElementText('#tdo_58')) {
            return parseInt(getElementText('#tdo_58') || '', 10);
          }

          return parseInt(getElementText('#tdo_1') || '', 10);
        } catch (e) {}
      })(),
    },
    { NaNValues: true },
  );

  if (isEqual(Object.keys(data), ['source', 'url', 'category', 'type'])) {
    return;
  }

  return data;
}

export default runCrawler;
