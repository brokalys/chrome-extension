import { useMemo, useState } from 'react';

import { RESULT_CLASSIFIED, RESULT_REAL_SALE } from 'src/constants';
import useHistoricalData from 'src/hooks/api/use-historical-data';
import usePageClassified from 'src/hooks/use-page-classified';
import type { CrawledClassified } from 'src/types';

import SidePanel from './components/SidePanel';
import SidePanelOpenButton from './components/SidePanelOpenButton';

const App: React.FC = () => {
  const { data, loading } = usePageClassified();

  if (loading || !data) return null;

  return <Content pageClassified={data} />;
};

interface ContentProps {
  pageClassified: CrawledClassified;
}

const Content: React.FC<ContentProps> = ({ pageClassified }) => {
  const { loading, error, data } = useHistoricalData(pageClassified);
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    return [
      ...data.properties.map((row) => ({
        ...row,
        source: RESULT_CLASSIFIED,
      })),
      ...(data.vzd?.apartments.map((row) => ({
        ...row,
        category: 'apartment',
        type: 'sell',
        calc_price_per_sqm: row.area ? row.price / row.area : null,
        source: RESULT_REAL_SALE,
      })) || []),
      ...(data.vzd?.premises.map((row) => ({
        ...row,
        category: 'premise',
        type: 'sell',
        calc_price_per_sqm: row.area ? row.price / row.area : null,
        source: RESULT_REAL_SALE,
      })) || []),
      ...(data.vzd?.houses.map((row) => ({
        ...row,
        category: 'house',
        type: 'sell',
        calc_price_per_sqm: row.area ? row.price / row.area : null,
        source: RESULT_REAL_SALE,
      })) || []),
    ];
  }, [data]);

  return (
    <>
      {!isOpen && (
        <SidePanelOpenButton
          isLoading={loading}
          results={pageClassified.category === 'land' ? [] : results}
          onOpenClick={() => setIsOpen(true)}
        />
      )}

      <SidePanel
        isOpen={isOpen}
        isLoading={loading}
        building={data.building}
        results={results}
        error={error}
        pageClassified={pageClassified}
        onCloseClick={() => setIsOpen(false)}
      />
    </>
  );
};

export default App;
