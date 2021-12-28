import useHistoricalData from 'hooks/api/use-historical-data';
import usePageClassified from 'hooks/use-page-classified';

function App() {
  const { data, loading } = usePageClassified();

  if (loading) {
    return 'Loading';
  }
  console.log('here', data);

  return (
    <div>
      <Data lat={data.lat} lng={data.lng} />
      <p>{data.source}</p>
    </div>
  );
}

function Data({ lat, lng }) {
  const { loading, error, data } = useHistoricalData(lat, lng);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  console.log('data', data);
  return <p>Test</p>;
}

export default App;
