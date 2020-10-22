import { useState } from 'react';
import useSWR from 'swr';
import { appendApiPrefix } from 'utils/api';
const isNew = true;
const durations = {
  day: 'interval=3600&limit=24',
  hour: 'interval=60&limit=60',
  month: 'interval=2592&limit=99',
  all: 'interval=5000&limit=99',
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
