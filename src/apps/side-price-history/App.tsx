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

function Content(props: ContentProps) {
  const { lat, lng } = props.pageClassified;

  const { loading, error, data } = useHistoricalData(lat!, lng!);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <SidePanelOpenButton
          isLoading={loading}
          results={data.properties}
          onOpenClick={() => setIsOpen(true)}
        />
      )}

      <SidePanel
        isOpen={isOpen}
        isLoading={loading}
        data={data}
        error={error}
        pageClassified={props.pageClassified}
        onCloseClick={() => setIsOpen(false)}
      />
    </>
  );
}

export default App;
