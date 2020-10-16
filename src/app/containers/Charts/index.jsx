import React from 'react';
import { Chart } from '../../components/Chart/Loadable';
export function Charts() {
  return (
    <div>
      <Chart width={500} />
      <Chart width={450} indicator="tps" />
      <Chart width={403} indicator="difficulty" />
      <Chart width={343} indicator="hashRate" />
    </div>
  );
}
