import { useState } from 'react';

import useHistoricalData from 'src/hooks/api/use-historical-data';
import usePageClassified from 'src/hooks/use-page-classified';
import type { CrawledClassified } from 'src/types';

import SidePanel from './components/SidePanel';
import SidePanelOpenButton from './components/SidePanelOpenButton';

function App() {
  const { data, loading } = usePageClassified();

  if (loading || !data) return null;

  return <Content pageClassified={data} />;
}

interface ContentProps {
  pageClassified: CrawledClassified;
}

const Content: React.FC<ContentProps> = ({ pageClassified }) => {
  const { loading, error, data } = useHistoricalData(pageClassified);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <SidePanelOpenButton
          isLoading={loading}
          results={pageClassified.category === 'land' ? [] : data.properties}
          onOpenClick={() => setIsOpen(true)}
        />
      )}

      <SidePanel
        isOpen={isOpen}
        isLoading={loading}
        data={data}
        error={error}
        pageClassified={pageClassified}
        onCloseClick={() => setIsOpen(false)}
      />
    </>
  );
};

export default App;
