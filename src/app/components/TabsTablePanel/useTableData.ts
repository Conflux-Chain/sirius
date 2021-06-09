import { useTableDataByHttp } from 'utils/hooks/useTableDataByHttp';
import { useGetPendingTxnByRPC } from 'utils/hooks/useGetPendingTxnByRPC';

export const useTableData = (
  url: string,
  inactive = false,
  shouldFetch = true,
) => {
  if (url.startsWith('/rpc/cfx_getAccountPendingTransactions')) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useGetPendingTxnByRPC(url);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTableDataByHttp(url, inactive, shouldFetch);
  }
};
