import { useState } from 'react';
import useSWR from 'swr';
import { appendApiPrefix } from 'utils/api';
import { NUM_X_GRID } from './draw';
import fetch from 'utils/request';
// 2592000
const durations = {
  hour: [
    `interval=${parseInt(3600 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
    'HH:mm',
  ],
  day: [
    `interval=${parseInt(86400 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
    'DD/HH',
  ],
  month: [
    `interval=${parseInt(2592000 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
    'MM/DD',
  ],
  all: [`limit=${NUM_X_GRID}`, 'MM/DD'],
};

export default function usePlot(defaultDuration = 'day') {
  const [duration, setDuration] = useState(defaultDuration);
  const { data, error } = useSWR(`/dashboard/plot?duration=${duration}`, url =>
    fetch(appendApiPrefix(`/plot?${durations[duration][0]}`)),
  );
  const format = durations[duration][1];
  let listData;
  if (data) {
    const { list } = data;
    listData = list;
  }
  return {
    plot: listData,
    isLoading: !error && !data,
    isError: error,
    setDuration,
    duration,
    format,
  };
}
