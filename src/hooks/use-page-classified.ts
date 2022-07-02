import Bugsnag from '@bugsnag/js';
import { useEffect, useState } from 'react';

import loadCity24LvData from 'src/lib/crawlers/city24-lv';
import loadSsLvData from 'src/lib/crawlers/ss-lv';
import type { CrawledClassified } from 'src/types';

async function loadDataFrom(
  source: string,
): Promise<CrawledClassified | undefined> {
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
 * Poll for changes in location.pathname
 */
const useReactPath = () => {
  const [path, setPath] = useState(window.location.pathname);
  const listenToPopstate = () => {
    const winPath = window.location.pathname;
    setPath(winPath);
  };

  useEffect(() => {
    const interval = setInterval(listenToPopstate, 1000);
    return () => {
      window.clearInterval(interval);
    };
  }, []);
  return path;
};

/**
 * Retrieves the scraped data from the content script.
 */
export default function usePageClassified() {
  const path = useReactPath();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<CrawledClassified | undefined>();

  useEffect(() => {
    async function run() {
      const source = window.location.hostname.replace(/^www\./, '');

      setIsLoading(true);
      setData(undefined);
      const data = await loadDataFrom(source);

      setIsLoading(false);
      setData(data);
    }
    run();
  }, [path]);

  return {
    data,
    loading: isLoading,
  };
}
