import { useEffect, useState } from 'react';
import loadSsLvData from 'lib/crawlers/ss-lv';

/**
 * Retrieves the scraped data from the content script.
 */
export default function usePageClassified() {
  const [data, setData] = useState();

  useEffect(() => {
    async function run() {
      setData(loadSsLvData());
    }
    run();
  }, []);

  console.log('usePageClassified', data);
  return {
    data,
    loading: !data,
  };
}
