import useSWRImmutable from 'swr/immutable';
import { reqTransactionEventlogs } from 'utils/httpRequest';

export const useTxEventLogs = (hash?: string, shouldFetch = true) => {
  return useSWRImmutable<any[]>(
    shouldFetch && hash ? `tx event log ${hash}` : null,
    async () => {
      const res = await reqTransactionEventlogs({
        transactionHash: hash,
        aggregate: false,
      });
      return res.list;
    },
  );
};
