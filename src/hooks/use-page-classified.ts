import Bugsnag from '@bugsnag/js';
import { useEffect, useState } from 'react';

import loadCity24LvData from 'src/lib/crawlers/city24-lv';
import loadSsLvData from 'src/lib/crawlers/ss-lv';
import type { CrawledClassified } from 'src/types';

function loadDataFrom(source: string): CrawledClassified | undefined {
  switch (source) {
    case 'ss.com':
    case 'ss.lv':
      return loadSsLvData();

    case 'city24.lv':
      return loadCity24LvData();

    default:
      Bugsnag.notify(new Error(`Unrecognized source: ${source}`));
  }
}

/**
 * Retrieves the scraped data from the content script.
 */
export default function usePageClassified() {
  const [data, setData] = useState<CrawledClassified | undefined>();

  useEffect(() => {
    async function run() {
      const source = window.location.hostname.replace(/^www\./, '');
      setData(loadDataFrom(source));
    }
    run();
  }, []);

  return {
    data,
    loading: !data,
  };
}
