import { useState } from 'react';
import useSWR from 'swr';
import { appendApiPrefix } from 'utils/api';
import fetch from 'utils/request';
import { useTranslation } from 'react-i18next';

// get charts data
export default function usePlot(
  defaultDuration = 'day',
  NUM_X_GRID = 7,
  indicator = 'blockTime',
) {
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

  let swrKey = `/dashboard/plot?duration=${duration}`;
  let fetcher = () => fetch(appendApiPrefix(`/plot?${durations[duration][0]}`));
  let axisFormat = durations[duration][1];
  let popupFormat = durations[duration][2];

  switch (indicator) {
    // without durations
    case 'dailyTransaction':
      swrKey = `/txn/daily/list`;
      fetcher = () =>
        fetch(appendApiPrefix(`/stat/txn/daily/list?limit=${31}`)); // TODO adjust limit
      axisFormat = ['MMM DD', 'MM-DD'];
      popupFormat = ['MMM DD, YYYY', 'YYYY-MM-DD'];
      break;
    case 'dailyTransactionTokens':
      swrKey = `/txn/dailyToken/list`;
      fetcher = () =>
        fetch(appendApiPrefix(`/stat/tokens/daily-token-txn?limit=${31}`)); // TODO adjust limit
      axisFormat = ['MMM DD', 'MM-DD'];
      popupFormat = ['MMM DD, YYYY', 'YYYY-MM-DD'];
      break;
    // without durations
    case 'cfxHoldingAccounts':
      swrKey = `/cfx_holder/daily/list`;
      fetcher = () =>
        fetch(appendApiPrefix(`/stat/cfx_holder/daily/list?limit=${31}`));
      axisFormat = ['MMM DD', 'MM-DD'];
      popupFormat = ['MMM DD, YYYY', 'YYYY-MM-DD'];
      break;
    default:
      break;
  }

  const { data, error } = useSWR(swrKey, fetcher);
  let listData;
  if (data) {
    switch (indicator) {
      case 'dailyTransaction':
        listData = data?.data?.rows || [];
        break;
      case 'dailyTransactionTokens':
        listData = data?.list || [];
        break;
      case 'cfxHoldingAccounts':
        listData = data?.data?.rows || [];
        break;
      default:
        listData = data?.list || [];
        break;
    }
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
