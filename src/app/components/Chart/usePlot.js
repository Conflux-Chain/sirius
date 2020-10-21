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
    fetch(
      isNew
        ? `http://182.92.71.168:8885/v1/plot?${durations[duration]}`
        : appendApiPrefix(url),
    ).then(response => response.json()),
  );
  // const { data, error } = useSWR(`/dashboard/plot?duration=${duration}`, url =>
  //   fetch(appendApiPrefix(url)).then(response => response.json()),
  // );
  // fetch('http://182.92.71.168:8885/v1/plot?interval=10000&limit=10').then(x => {
  //   console.log(x);
  // });
  let listData;
  console.log(data);
  if (data) {
    if (isNew) {
      const { list } = data;
      listData = list;
    } else {
      const {
        result: { list },
      } = data;
      listData = list;
    }
  }
  return {
    plot: listData,
    isLoading: !error && !data,
    isError: error,
    setDuration,
    duration,
  };
}
