import React, { useEffect, createContext, useContext } from 'react';
import { useGetTxnStatus } from 'sirius-next/packages/common/dist/utils/hooks/useGetTxnStatus';
import { usePortal } from './usePortal';
import pubsub from '../pubsub';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

const noop = () => {};

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

export interface Record {
  hash: string;
  timestamp: number;
  status: number | null;
  info: string;
}

export interface UseTxnHistoryConfig {
  localstorageKey?: string;
  maxCount?: number;
  maxDurationSecond?: number;
  limit?: number;
  skip?: number;
  status?: Pick<Record, 'status'> | undefined;
  convert?: (info: string, record: Record) => string; // covert info, such as return i18n
}

export interface GetRecords {
  skip?: number;
  limit?: number;
  status?: number | null;
}

export type GetRecordsKey = Array<string>;

const DEFAULT_CONTEXT_CONFIG = {
  localstorageKey: LOCALSTORAGE_KEYS_MAP.txnRecords,
  maxCount: 100,
  maxDurationSecond: 86400,
  limit: 10,
  skip: 0,
  status: undefined,
  convert: info => info,
};

const getNowTimestamp = () => {
  return Math.ceil(+new Date() / 1000);
};

// txn history context
export const TxnHistoryContext = createContext<{
  config: UseTxnHistoryConfig;
  pendingRecords: Array<Record>;
  updatePendingRecords?: (records: Array<Record>) => void;
}>({
  config: {},
  pendingRecords: [],
  updatePendingRecords: noop,
});

// txn history context providor wrapper, with default config and state handler
export const TxnHistoryProvider = function ({ children, value }) {
  const [pendingRecords, setPendingRecords] = React.useState<Array<Record>>([]);
  return React.createElement(
    TxnHistoryContext.Provider,
    {
      value: {
        config: DEFAULT_CONTEXT_CONFIG,
        pendingRecords: pendingRecords,
        updatePendingRecords: setPendingRecords,
        ...value,
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

export const useTxnHistory = (opts?: UseTxnHistoryConfig) => {
  const { installed } = usePortal();

  const config = {
    ...DEFAULT_CONTEXT_CONFIG,
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
    let records: Array<Record> = txnHistoryStore.getItem(
      config.localstorageKey,
    );
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
    if (!hash) {
      return;
    }
    // @ts-ignore
    let records: Array<Record> = getRecords({
      limit: config.maxCount,
    });
    if (!records.some(r => r.hash === hash)) {
      const newRecords = [
        {
          hash: hash,
          status: status === undefined ? null : status,
          timestamp: timestamp || getNowTimestamp(),
          info: info || '',
        },
      ].concat(records);
      txnHistoryStore.setItem(config.localstorageKey, newRecords);
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
      txnHistoryStore.setItem(config.localstorageKey, newRecords);
      initPendingRecords();
    }
  };

  const clearRecords = function () {
    // @ts-ignore
    txnHistoryStore.setItem(config.localstorageKey, []);
    initPendingRecords();
  };

  const updateRecords = function (status) {
    // @ts-ignore
    const records: Array<Record> = getRecords({
      limit: config.maxCount,
    });
    const newRecords = records.map(r => {
      if (status[r.hash] !== undefined) {
        if (status[r.hash] !== null && r.status !== status[r.hash]) {
          pubsub.publish('notify', {
            type: 'wallet',
            option: {
              info: r.info,
              status: status[r.hash],
            },
          });
        }
        r.status = status[r.hash];
      }
      return r;
    });
    txnHistoryStore.setItem(config.localstorageKey, newRecords);
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

  if (!installed) {
    return {
      addRecord: noop,
      getRecords: () => [],
      removeRecords: noop,
      clearRecords: noop,
    };
  } else {
    return {
      addRecord,
      getRecords,
      removeRecords,
      clearRecords,
    };
  }
};
