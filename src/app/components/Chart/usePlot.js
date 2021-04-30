import { useState } from 'react';
import useSWR from 'swr';
import { appendApiPrefix } from 'utils/api';
import fetch from 'utils/request';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

// get charts data
export default function usePlot(
  defaultDuration = 'day',
  NUM_X_GRID = 7,
  indicator = 'blockTime',
  limit = 31,
  address = '',
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

  // url = swrKey
  switch (indicator) {
    case 'dailyTransaction':
      swrKey = `/stat/txn/daily/list`;
      break;
    case 'dailyTransactionCFX':
      swrKey = `/stat/daily-cfx-txn`;
      break;
    case 'dailyTransactionTokens':
      swrKey = `/stat/tokens/daily-token-txn`;
      break;
    case 'cfxHoldingAccounts':
      swrKey = `/stat/cfx_holder/daily/list`;
      break;
    case 'accountGrowth':
      swrKey = `/stat/daily-address-creation`;
      break;
    case 'activeAccounts':
      swrKey = `/stat/daily-active-address`;
      break;
    case 'contractAmount':
      swrKey = `/stat/contract/daily/list`;
      break;
    case 'tokenAnalysis':
      swrKey = `/stat/daily-token-stat`;
      break;
    default:
      break;
  }

  // date format
  switch (indicator) {
    case 'dailyTransaction':
    case 'dailyTransactionCFX':
    case 'dailyTransactionTokens':
    case 'cfxHoldingAccounts':
    case 'accountGrowth':
    case 'activeAccounts':
    case 'contractAmount':
      axisFormat = ['MMM DD', 'MM-DD'];
      popupFormat = ['MMM DD, YYYY', 'YYYY-MM-DD'];
      fetcher = () => fetch(appendApiPrefix(`${swrKey}?limit=${limit}`));
      break;
    case 'tokenAnalysis':
      axisFormat = ['MMM DD', 'MM-DD'];
      popupFormat = ['MMM DD, YYYY', 'YYYY-MM-DD'];
      fetcher = () =>
        fetch(appendApiPrefix(`${swrKey}?limit=${limit}&base32=${address}`));
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
      case 'cfxHoldingAccounts':
        listData = data?.data?.rows || [];
        break;
      case 'accountGrowth':
        // filter genesis block
        listData =
          data?.list?.filter(
            d => dayjs(d['day']).diff('2018-01-01', 'day') > 0,
          ) || [];
        break;
      case 'activeAccounts':
        // filter genesis block
        listData = data?.list || [];
        break;
      case 'contractAmount':
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
