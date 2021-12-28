import { useEffect, useState } from 'react';
// import * as chrome from 'lib/chrome';
import loadData from 'lib/crawlers/ss-lv';

/**
 * Retrieves the scraped data from the content script.
 */
export default function usePageClassified() {
  const [data, setData] = useState();

  useEffect(() => {
    async function run() {
      setData(loadData());
      // setData(await chrome.sendMessage({ type: 'GET_PAGE_CLASSIFIED' }));
    }
    run();
  }, []);

  console.log('usePageClassified', data);
  return {
    data,
    loading: !data,
  };
}
