/* global chrome */

function attachIframe() {
  const extensionOrigin = 'chrome-extension://' + chrome.runtime.id;

  if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // fetch(chrome.runtime.getURL('index.html'))
    //   .then((response) => response.text())
    //   .then((html) => {
    //     const styleStashHTML = html.replace(/\/static\//g, `${extensionOrigin}/static/`);
    //     // window.$(styleStashHTML).appendTo('body');

    //     const wrapper = document.createElement("div");
    //     wrapper.innerHTML = styleStashHTML;
    //     console.log('wrapper', wrapper);
    //     console.log('wrapper', wrapper.querySelector('body'));

    //     document.body.appendChild(wrapper);
    //   })
    //   .catch((error) => {
    //     console.warn(error);
    //   });

    // const iframe = document.createElement('iframe');
    // iframe.setAttribute('src', chrome.runtime.getURL('index.html'));
    // iframe.style.width = "640px";
    // iframe.style.height = "480px";
    // iframe.style.position = 'fixed';
    // iframe.style.top = 0;
    // iframe.style.right = 0;
    // iframe.style.zIndex = 100;
    // document.body.appendChild(iframe);
  }
}

function runCrawler() {
  let category;
  switch (document.querySelector('.headtitle a').textContent) {
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
    case 'Telpas':
    case 'Mežs':
      category = 'other';
      break;
  }

  let type;
  switch (document.querySelector('.headtitle').textContent.replace(/^(.*)\/ /, '')) {
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

  function getElementText(selector) {
    const element = document.querySelector(selector);

    if (!element) {
      return '';
    }

    return element.textContent;
  }

  const priceText = getElementText('#tdo_8');
  const price = priceText.match(/^([0-9\s\.]+) €/)[1].replace(/\s/g, '');
  const price_per_sqm = priceText.match(/\(([0-9\s\.]+) €/)[1].replace(/\s/g, '');
  const rent_type = (() => {
    try {
      const identifier = priceText.match(/€\/(.*?) /)[1];

      switch (identifier) {
        case 'st.':
          // @todo: RU & EN
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
      }
    } catch (e) {}
  })();

  const data = {
    source: 'ss.lv',
    url: document.location.origin + document.location.pathname,
    category,
    type,
    rent_type,

    price,
    price_per_sqm,

    lat: (() => {
      try {
        return document.querySelector('#mnu_map').getAttribute('onclick').match(/c=([0-9\.]+),\s?([0-9\.]+),/)[1];
      } catch (e) {}
    })(),
    lng: (() => {
      try {
        return document.querySelector('#mnu_map').getAttribute('onclick').match(/c=([0-9\.]+),\s?([0-9\.]+),/)[2];
      } catch (e) {}
    })(),

    location_district: getElementText('#tdo_20'),
    location_parish: getElementText('#tdo_856'),
    location_address: getElementText('#tdo_11 b'),
    location_village: getElementText('#tdo_368'),

    rooms: (() => {
      try {
        return getElementText('#tdo_1');
      } catch (e) {}
    })(),

    area: (() => {
      try {
        return getElementText('#tdo_3').match(/^([0-9]+) /)[1];
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
        return getElementText('#tdo_4').match(/^([0-9]+)\/([0-9]+)$/)[1];
      } catch (e) {}
    })(),
    max_floors: (() => {
      try {
        return getElementText('#tdo_4').match(/^([0-9]+)\/([0-9]+)$/)[2];
      } catch (e) {}
    })(),

    content: (() => {
      try {
        const el = document.querySelector('#msg_div_msg').cloneNode(true);
        el.querySelector('table').remove();
        el.querySelector('table').remove();
        return el.textContent.trim();
      } catch (e) {}
    })(),

    contact_phone: getElementText('#ph_td_1'),
    contact_phone2: getElementText('#ph_td_2'),
    contact_company: (() => {
      try {
        return document.querySelector('#usr_logo').parentElement.parentElement.previousElementSibling.querySelector('.ads_contacts').textContent;
      } catch (e) {}
    })(),

    building_project: getElementText('#tdo_6'),
    building_material: getElementText('#tdo_2'),

    images: [...document.querySelectorAll('.pic_dv_thumbnail a')].map((el) => el.href),

    foreign_id: (() => {
      try {
        const el = [...document.querySelectorAll('script')].find((el) => el.src.includes('chk.php'));
        return el.src.match(/m=(.*?)&/)[1];
      } catch (e) {}
    })(),

    additional_data: {
      convenience: getElementText('#tdo_59'),
      land_usage: getElementText('#tdo_228'),
    },

    cadastre_number: getElementText('#tdo_1631'),
    land_area: (() => {
      try {
        return getElementText('#tdo_60').match(/^([0-9]+) /)[1];
      } catch (e) {}
    })(),
    land_area_measurement: (() => {
      try {
        const area = getElementText('#tdo_60');
        return area.endsWith('m²') ? 'm2' : undefined;
      } catch (e) {}
    })(),
    published_at: document.querySelector('.msg_footer[align="right"]').textContent.replace(/^(.*?): /, ''),

    views: (() => {
      const views = parseInt(getElementText('#show_cnt_stat'), 10);

      if (views > 1) {
        return views;
      }
    })(),
  };

  // Remove blanks
  Object.keys(data).forEach((key) => {
    if (!data[key] || data[key] === '') {
      delete data[key];
    }
  });
  Object.keys(data.additional_data).forEach((key) => {
    if (!data.additional_data[key] || data.additional_data[key] === '') {
      delete data.additional_data[key];
    }
  });

  console.log('data', data);
  // @todo: send the data
  window.postMessage({ type: "SS_LV_CRAWLED_DATA", payload: data }, "*");

  chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
  });
  return data;
}

if (/real-estate/.test(document.location.pathname) && document.location.pathname.startsWith('/msg/')) {
  attachIframe();
  setTimeout(runCrawler, 200);
}

window.addEventListener("message", function(event) {
  console.log('received message', event.data);
  if (event.source !== window) return;
  onDidReceiveMessage(event);
});

async function onDidReceiveMessage(event) {
  if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
    window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
  }
}

chrome.runtime.onMessage.addListener(
 function(request, sender, response) {
   console.log('got some message');
   response(runCrawler());
});

// fetch('https://6085b1a7d14a870017578278.mockapi.io/Classifieds', {
//   method: 'POST',
//   cors: 'no-cors',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     name: 'Test'
//   })
// })
//   .then((res) => res.json())
//   .then(console.log);
