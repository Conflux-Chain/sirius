import { useState } from 'react';
import useSWR from 'swr';
import { appendApiPrefix } from 'utils/api';
import fetch from 'utils/request';
import { useTranslation } from 'react-i18next';

export default function usePlot(defaultDuration = 'day', NUM_X_GRID = 7) {
  // 2592000
  const durations = {
    hour: [
      `interval=${parseInt(3600 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
      ['HH:mm'],
      ['MMM DD, YYYY HH:mm', 'YYYY-MM-DD HH:mm'],
    ],
    day: [
      `interval=${parseInt(86400 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
      ['MMM DD\nHH:00', 'MM-DD\nHH:00'],
      ['MMM DD, YYYY HH:00', 'YYYY-MM-DD HH:00'],
    ],
    month: [
      `interval=${parseInt(2592000 / NUM_X_GRID)}&limit=${NUM_X_GRID}`,
      ['MMM DD', 'MM-DD'],
      ['MMM DD, YYYY', 'YYYY-MM-DD'],
    ],
    all: [
      `limit=${NUM_X_GRID}`,
      ['MMM DD', 'MM-DD'],
      ['MMM DD, YYYY', 'YYYY-MM-DD'],
    ],
  };

  const [duration, setDuration] = useState(defaultDuration);
  const { i18n } = useTranslation();
  const isEn = i18n.language.indexOf('en') > -1;
  const { data, error } = useSWR(`/dashboard/plot?duration=${duration}`, url =>
    fetch(appendApiPrefix(`/plot?${durations[duration][0]}`)),
  );
  const axisFormat = durations[duration][1];
  const popupFormat = durations[duration][2];
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
    axisFormat: isEn ? axisFormat[0] : axisFormat[1] || axisFormat[0],
    popupFormat: isEn ? popupFormat[0] : popupFormat[1] || popupFormat[0],
  };
}
