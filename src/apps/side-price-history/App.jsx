import useHistoricalData from 'hooks/api/use-historical-data';
import usePageClassified from 'hooks/use-page-classified';
import React from 'react';

import SideBarOpenButton from './components/SideBarOpenButton';
import SideBar from './components/SideBar';

function App() {
  const { data, loading } = usePageClassified();

  // @todo? does this even need loading state?
  if (loading) return null;

  return <Content pageClassified={data} />;
}

function Content(props) {
  const { lat, lng } = props.pageClassified;

  // @todo: error handling
  const { loading, error, data } = useHistoricalData(lat, lng);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <SideBarOpenButton
        isLoading={loading}
        results={data.properties}
        onOpenClick={() => setIsOpen(true)}
      />

      <SideBar
        isOpen={isOpen}
        isLoading={loading}
        data={data}
        pageClassified={props.pageClassified}
        onCloseClick={() => setIsOpen(false)}
      />
    </>
  );
}

export default App;
