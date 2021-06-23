import { useTableDataByHttp } from 'utils/hooks/useTableDataByHttp';
import { useGetPendingTxnByRPC } from 'utils/hooks/useGetPendingTxnByRPC';
import { useGetTxnInternalTrace } from 'utils/hooks/useGetTxnInternalTrace';

export const useTableData = (
  url: string,
  inactive = false,
  shouldFetch = true,
) => {
  if (url.startsWith('/rpc')) {
    if (url.startsWith('/rpc/cfx_getAccountPendingTransactions')) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGetPendingTxnByRPC(url);
    } else if (url.startsWith('/rpc/trace_transaction')) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGetTxnInternalTrace(url);
    } else {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useTableDataByHttp(url, inactive, shouldFetch);
    }
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTableDataByHttp(url, inactive, shouldFetch);
  }
};
