import React from 'react';
import { Chart as ChartComponent } from '../../components/Chart/Loadable';
function Chart() {
  return (
    <div>
      <ChartComponent width={500} />
      <ChartComponent width={450} indicator="tps" />
      <ChartComponent width={403} indicator="difficulty" />
      <ChartComponent width={343} indicator="hashRate" />
    </div>
  );
}

export default Chart;
