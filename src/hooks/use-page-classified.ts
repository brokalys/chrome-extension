import { useEffect, useState } from 'react';

import loadSsLvData from 'src/lib/crawlers/ss-lv';
import type { CrawledClassified } from 'src/types';

/**
 * Retrieves the scraped data from the content script.
 */
export default function usePageClassified() {
  const [data, setData] = useState<CrawledClassified>();

  useEffect(() => {
    async function run() {
      setData(loadSsLvData());
    }
    run();
  }, []);

  return {
    data,
    loading: !data,
  };
}
