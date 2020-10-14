import React from 'react';
import Chart from '../../components/Chart/Chart';
function App() {
  return (
    <div className="App">
      <Chart width={500} />
      <Chart width={450} indicator="tps" />
      <Chart width={403} indicator="difficulty" />
      <Chart width={343} indicator="hashRate" />
    </div>
  );
}

export default App;
