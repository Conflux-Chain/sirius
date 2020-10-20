import { useState } from 'react';
import useSWR from 'swr';
import { appendApiPrefix } from 'utils/api';
export default function usePlot(defaultDuration = 'day') {
  const [duration, setDuration] = useState(defaultDuration);
  const { data, error } = useSWR(`/dashboard/plot?duration=${duration}`, url =>
    fetch(appendApiPrefix(url)).then(response => response.json()),
  );
  let listData;
  if (data) {
    const {
      result: { list },
    } = data;
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
