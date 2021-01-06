import React, { useEffect, createContext, useContext } from 'react';
import { useGetTxnStatus } from './useGetTxnStatus';

const txnHistoryStore = {
  setItem: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getItem: key => {
    let data = localStorage.getItem(key);
    return data && JSON.parse(data);
  },
  clear: () => {
    localStorage.clear();
  },
};

export interface UseTxnHistory {
  maxDurationSecond: number;
  maxCount: number;
}

export interface Record {
  hash: string;
  timestamp: number;
  status: number | null;
  info: string;
}

export interface GetRecords {
  skip?: number;
  limit?: number;
  status?: number | null;
}

export type GetRecordsKey = Array<string>;

const RECORDS_KEY = 'SCAN_TXN_RECORDS';
const MAX_DURATION_SECOND = 86400;
const MAX_COUNT = 100;
const LIMIT = 10;
const SKIP = 0;

const getNowTimestamp = () => {
  return Math.ceil(+new Date() / 1000);
};

// const getRandomString = () => {
//   return Math.random().toString(32).substr(2);
// };

export const TxnHistoryContext = createContext<{
  pendingRecords: Array<Record>;
  updatePendingRecords?: (records: Array<Record>) => void;
}>({
  pendingRecords: [],
  updatePendingRecords: () => {},
});

export const TxnHistoryProvider = function ({ children }) {
  const [pendingRecords, setPendingRecords] = React.useState<Array<Record>>([]);
  return React.createElement(
    TxnHistoryContext.Provider,
    {
      value: {
        pendingRecords: pendingRecords,
        updatePendingRecords: setPendingRecords,
      },
    },
    children,
  );
};

/**

Notes:

1. records format:
  [{
    hash: '',
    status: 0, // 0 - success, 1 - fail, null - pending,
    timestamp: 1000000000,
    info: 'create contract'
  }]
2. max store duration: 1d = 24 * 60 * 60
3. max store count: 100
4. keep track config.limit records, not all for performance

 */

export const useTxnHistory = (opts?: UseTxnHistory) => {
  const config = {
    maxCount: MAX_COUNT,
    maxDurationSecond: MAX_DURATION_SECOND,
    limit: LIMIT,
    skip: SKIP,
    status: undefined,
    ...opts,
  };

  const { pendingRecords, updatePendingRecords } = useContext(
    TxnHistoryContext,
  );

  const { status } = useGetTxnStatus(pendingRecords.map(r => r.hash));

  // if keys is undefined, return all records
  const getRecords = function (opts?: GetRecords) {
    const { limit, skip, status } = config;
    const options = {
      limit,
      skip,
      status,
      ...opts,
    };
    // @ts-ignore
    let records: Array<Record> = txnHistoryStore.getItem(RECORDS_KEY);
    if (records) {
      // filter records not outdate
      // if maxDurationSecond = 0, return all
      if (config.maxDurationSecond > 0) {
        const now = getNowTimestamp();
        records = records.filter(
          r => r.timestamp + config.maxDurationSecond >= now,
        );
      }
      // filter maximum records
      if (records.length > config.maxCount) {
        records = records.slice(0, config.maxCount);
      }
      if (options.status !== undefined) {
        records = records.filter(r => r.status === options.status);
      }
      records = records.slice(options.skip, options.skip + options.limit);
      // @todo listening filtered records status
    } else {
      records = [];
    }
    return records;
  };

  const addRecord = function ({
    hash,
    status,
    timestamp,
    info,
  }: Pick<Record, 'hash'> & Partial<Omit<Record, 'hash'>>) {
    // @ts-ignore
    let records: Array<Record> = getRecords({
      limit: config.maxCount,
    });
    if (!records.some(r => r.hash === hash)) {
      const newRecords = records.concat({
        hash: hash,
        status: status === undefined ? null : status,
        timestamp: timestamp || getNowTimestamp(),
        info: info || '',
      });
      txnHistoryStore.setItem(RECORDS_KEY, newRecords);
      initPendingRecords();
    }
  };

  const removeRecords = function (keys?: GetRecordsKey) {
    // filter by keys
    if (keys && keys.length) {
      const keysMap = keys.reduce((prev, curr) => {
        prev[curr] = true;
        return prev;
      }, {});
      // @ts-ignore
      let records: Array<Record> = getRecords({
        limit: config.maxCount,
      });
      let newRecords = records.filter(r => !keysMap[r.hash]);
      txnHistoryStore.setItem(RECORDS_KEY, newRecords);
      initPendingRecords();
    }
  };

  const clearRecords = function () {
    // @ts-ignore
    txnHistoryStore.clear();
    initPendingRecords();
  };

  const updateRecords = function (status) {
    // @ts-ignore
    const records: Array<Record> = getRecords({
      limit: config.maxCount,
    });
    const newRecords = records.map(r => {
      if (status[r.hash] !== undefined) {
        r.status = status[r.hash];
      }
      return r;
    });
    txnHistoryStore.setItem(RECORDS_KEY, newRecords);
    initPendingRecords();
  };

  const initPendingRecords = function () {
    const pendingRecords = getRecords({
      limit: config.maxCount,
      status: null,
    });

    // @ts-ignore
    updatePendingRecords(pendingRecords);
  };

  useEffect(() => {
    initPendingRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateRecords(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return {
    // pendingRecords,
    pendingRecordsStatus: status,
    addRecord,
    getRecords,
    removeRecords,
    clearRecords,
  };
};
