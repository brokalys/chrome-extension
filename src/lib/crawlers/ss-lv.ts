import removeEmpty from 'clean-deep';

import type { CrawledClassified } from 'src/types';

function runCrawler(): CrawledClassified {
  let category;
  switch (document.querySelector('.headtitle a')?.textContent) {
    case 'Dzīvokļi':
    case 'Квартиры':
    case 'Flats':
      category = 'apartment';
      break;
    case 'Mājas, vasarnīcas':
    case 'Дома, дачи':
    case 'Houses, cottages':
      category = 'house';
      break;
    case 'Zeme':
    case 'Земля и участки':
    case 'Land and plots':
      category = 'land';
      break;
    case 'Biroji':
    case 'Офисы':
    case 'Offices':
      category = 'office';
      break;
    case 'Mežs':
    case 'Лес':
    case 'Forest':
      category = 'forest';
      break;
    case 'Telpas':
    case 'Помещения':
    case 'Premises':
    default:
      category = 'other';
      break;
  }

  let type;
  switch (
    document.querySelector('.headtitle')?.textContent?.replace(/^(.*)\/ /, '')
  ) {
    case 'Pārdod':
    case 'Продают':
    case 'Sell':
      type = 'sell';
      break;
    case 'Īrē':
    case 'Снимут':
    case 'Will remove': // haha.. ss.lv devs :D
      type = 'want_to_rent';
      break;
    case 'Izīrē':
    case 'Сдают':
    case 'Hand over':
      type = 'rent';
      break;
    case 'Pērk':
    case 'Покупают':
    case 'Buy':
      type = 'buy';
      break;
    case 'Maina':
    case 'Меняют':
    case 'Change':
      type = 'swap';
      break;

    case 'Dažādi':
    default:
      type = 'other';
      break;
  }

  function getElementText(selector: string): string {
    const element = document.querySelector(selector);

    if (!element) {
      return '';
    }

    return element.textContent || '';
  }

  const priceText = getElementText('#tdo_8');
  const price = priceText.match(/^([0-9\s.]+) €/)?.[1].replace(/\s/g, '');
  const rent_type = (() => {
    try {
      const identifier = priceText.match(/€\/(.*?) /)?.[1];

      switch (identifier) {
        case 'st.':
        case 'час':
        case 'hour':
          return 'hourly';

        case 'dienā':
        case 'день':
        case 'day':
          return 'daily';

        case 'ned.':
        case 'нед.':
        case 'week':
          return 'weekly';

        case 'mēn.':
        case 'мес.':
        case 'mon.':
          return 'monthly';

        default:
          throw new Error('Not able to match');
      }
    } catch (e) {}
  })();

  const data = removeEmpty<CrawledClassified>(
    {
      source: 'ss.lv',
      url: document.location.origin + document.location.pathname,
      category,
      type,
      rent_type,

      price: parseInt(price || '', 10),
      price_per_sqm: (() => {
        try {
          return parseFloat(
            priceText.match(/\(([0-9\s.]+) €/)?.[1].replace(/\s/g, '') || '',
          );
        } catch (e) {}
      })(),

      lat: (() => {
        try {
          return parseFloat(
            document
              .querySelector('#mnu_map')!
              .getAttribute('onclick')!
              .match(/c=([0-9.]+),\s?([0-9.]+),/)?.[1]!,
          );
        } catch (e) {}
      })(),
      lng: (() => {
        try {
          return parseFloat(
            document
              .querySelector('#mnu_map')!
              .getAttribute('onclick')!
              .match(/c=([0-9.]+),\s?([0-9.]+),/)?.[2] || '',
          );
        } catch (e) {}
      })(),

      location_district: getElementText('#tdo_20'),
      location_parish: getElementText('#tdo_856'),
      location_address: getElementText('#tdo_11 b'),
      location_village: getElementText('#tdo_368'),

      rooms: (() => {
        try {
          if (getElementText('#tdo_58')) {
            return parseInt(getElementText('#tdo_58') || '', 10);
          }

          return parseInt(getElementText('#tdo_1') || '', 10);
        } catch (e) {}
      })(),

      area: (() => {
        try {
          return parseInt(
            getElementText('#tdo_3').match(/^([0-9]+) /)?.[1] || '',
            10,
          );
        } catch (e) {}
      })(),
      area_measurement: (() => {
        try {
          const area = getElementText('#tdo_3');
          return area.endsWith('m²') ? 'm2' : undefined;
        } catch (e) {}
      })(),

      floor: (() => {
        try {
          return parseInt(
            getElementText('#tdo_4').match(/^([0-9]+)\/([0-9]+)/)?.[1] || '',
            10,
          );
        } catch (e) {}
      })(),
      max_floors: (() => {
        try {
          if (getElementText('#tdo_57')) {
            return parseInt(getElementText('#tdo_57'), 10);
          }

          if (getElementText('#tdo_5')) {
            return parseInt(getElementText('#tdo_5'), 10);
          }

          return parseInt(
            getElementText('#tdo_4').match(/^([0-9]+)\/([0-9]+)/)?.[2] || '',
            10,
          );
        } catch (e) {}
      })(),

      content: (() => {
        try {
          const el = document
            .querySelector('#msg_div_msg')!
            .cloneNode(true) as HTMLElement;
          el.querySelector('table')?.remove();
          el.querySelector('table')?.remove();
          return el.textContent!.trim();
        } catch (e) {}
      })(),

      building_project: getElementText('#tdo_6'),
      building_material: getElementText('#tdo_2'),

      images: [...document.querySelectorAll('.pic_dv_thumbnail a')]
        .map((el) => el.getAttribute('href') || '')
        .filter((href) => !!href),

      foreign_id: (() => {
        try {
          const el = [...document.querySelectorAll('script')].find((el) =>
            el.src.includes('chk.php'),
          )!;
          return el.src!.match(/m=(.*?)&/)?.[1];
        } catch (e) {}
      })(),

      additional_data: removeEmpty({
        convenience: getElementText('#tdo_59'),
        land_usage: getElementText('#tdo_228'),
      }),

      cadastre_number: getElementText('#tdo_1631'),
      land_area: (() => {
        try {
          return parseFloat(
            getElementText('#tdo_60').match(/^([0-9.]+) /)?.[1] || '',
          );
        } catch (e) {}
      })(),
      land_area_measurement: (() => {
        try {
          const area = getElementText('#tdo_60');

          if (area.endsWith('m²') || area.endsWith('м²')) {
            return 'm2';
          }

          if (area.endsWith('ha.') || area.endsWith('га.')) {
            return 'ha';
          }
        } catch (e) {}
      })(),
      published_at: document
        .querySelector('.msg_footer[align="right"]')
        ?.textContent?.replace(/^(.*?): /, ''),

      views: (() => {
        const views = parseInt(getElementText('#show_cnt_stat'), 10);

        if (views > 1) {
          return views;
        }
      })(),
    },
    { NaNValues: true },
  );

  return data;
}

export default runCrawler;
