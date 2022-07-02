import { useMemo, useState } from 'react';

import { RESULT_CLASSIFIED, RESULT_REAL_SALE } from 'src/constants';
import useHistoricalData, {
  BuildingResponse,
  LandResponse,
  Response,
} from 'src/hooks/api/use-historical-data';
import usePageClassified from 'src/hooks/use-page-classified';
import type { CrawledClassified } from 'src/types';

import SidePanel from './components/SidePanel';
import SidePanelOpenButton from './components/SidePanelOpenButton';

const App: React.FC = () => {
  const { data, loading } = usePageClassified();
  const [isOpen, setIsOpen] = useState(false);

  if (loading)
    return (
      <SidePanelOpenButton
        isLoading
        results={[]}
        onOpenClick={() => setIsOpen(true)}
      />
    );

  if (!data) return null;

  return (
    <Content pageClassified={data} isOpen={isOpen} setIsOpen={setIsOpen} />
  );
};

interface ContentProps {
  pageClassified: CrawledClassified;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

function isLand(data: Response): data is LandResponse {
  return data.estate?.type === 'land';
}
function isBuilding(data: Response): data is BuildingResponse {
  return data.estate?.type === 'building';
}

function mapResults(data: Response) {
  if (isLand(data)) {
    return [
      ...data.properties.results.map((row) => ({
        ...row,
        source: RESULT_CLASSIFIED,
      })),
      ...(data.vzd?.land.map((row) => ({
        ...row,
        category: 'land',
        type: 'sell',
        calc_price_per_sqm: row.area ? row.price / row.area : null,
        source: RESULT_REAL_SALE,
      })) || []),
    ];
  }

  if (isBuilding(data)) {
    return [
      ...data.properties.results.map((row) => ({
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
  }

  return [];
}

const Content: React.FC<ContentProps> = ({
  pageClassified,
  isOpen,
  setIsOpen,
}) => {
  const { loading, error, data } = useHistoricalData(pageClassified);

  const results = useMemo(() => mapResults(data), [data]);

  return (
    <>
      {!isOpen && (
        <SidePanelOpenButton
          isLoading={loading}
          results={results}
          onOpenClick={() => setIsOpen(true)}
        />
      )}

      <SidePanel
        isOpen={isOpen}
        isLoading={loading}
        estate={data.estate}
        results={results}
        error={error}
        pageClassified={pageClassified}
        onCloseClick={() => setIsOpen(false)}
      />
    </>
  );
};

export default App;
