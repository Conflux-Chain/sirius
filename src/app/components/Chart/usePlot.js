import { useState } from 'react';
import useSWR from 'swr';
import { appendApiPrefix } from 'utils/api';
import { NUM_X_GRID } from './draw';
// 2592000
const durations = {
  hour: `interval=${parseInt(3600 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
  day: `interval=${parseInt(86400 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
  month: `interval=${parseInt(2592000 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
  all: `interval=${parseInt(2592000 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
};
export default function usePlot(defaultDuration = 'day') {
  const [duration, setDuration] = useState(defaultDuration);
  const { data, error } = useSWR(`/dashboard/plot?duration=${duration}`, url =>
    fetch(appendApiPrefix(`/plot?${durations[duration]}`)).then(response =>
      response.json(),
    ),
  );
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
  };
}
