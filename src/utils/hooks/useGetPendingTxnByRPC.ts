import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { cfx } from 'utils/cfx';
import BigNumber from 'bignumber.js';
import pubsub from 'utils/pubsub';

// @ts-ignore
window.format = format;

// @ts-ignore
window.BigNumber = BigNumber;

export const useGetPendingTxnByRPC = (url: string, inactive = false) => {
  const location = useLocation();
  const history = useHistory();

  const [data2, setData2] = useState<{
    data: any;
    error: any;
  }>({
    data: null,
    error: null,
  });

  const { query } = queryString.parseUrl(url);
  let {
    page: searchPageNumber,
    pageSize: searchPageSize,
    txnStartNonce: searchTxnStartNonce,
    ...others
  } = queryString.parse(inactive ? '' : location.search);

  let parsedPageNumber = '1';
  let parsedPageSize = '10';

  try {
    const page = (Number(searchPageNumber) - 1) * Number(searchPageSize);
    if (window.isNaN(page) || page < 0) {
      throw new Error('invalid page');
    }
    parsedPageNumber = String(searchPageNumber);
  } catch (e) {}

  try {
    const pageSize = Number(searchPageSize);
    if (window.isNaN(pageSize) || pageSize < 0) {
      throw new Error('invalid pageSize');
    }
    parsedPageSize = String(pageSize);
  } catch (e) {}

  const txnStartNonce = searchTxnStartNonce || '0x0';

  const urlWithQuery = queryString.stringifyUrl({
    url,
    query: {
      ...query,
      ...others,
      page: parsedPageNumber,
      pageSize: parsedPageSize,
      txnStartNonce: txnStartNonce,
    },
  });

  useEffect(() => {
    // rpc call
    cfx.provider
      .call(
        'cfx_getAccountPendingTransactions',
        query.address,
        txnStartNonce,
        format.hex(Number(parsedPageSize) || 10), // default limit
      )
      .then(data => {
        setData2({
          ...data2,
          data,
        });
      })
      .catch(e => {
        setData2({
          ...data2,
          error: e,
        });
        pubsub.publish('notify', {
          type: 'request',
          option: {
            code: '30001', // rpc call error
            message: e.message,
          },
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlWithQuery]);

  const setPageNumberAndAlterHistory = (pageNumber: number) => {
    let nonce = txnStartNonce;
    if (pageNumber === 1) {
      nonce = '0x0';
    } else {
      if (data2) {
        const lastPendingTxn: any =
          data2.data.pendingTransactions[
            data2.data.pendingTransactions.length - 1
          ];
        nonce = `0x${(Number(lastPendingTxn?.nonce) + 1).toString(16)}`;
      }
    }

    const pathNameWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        page: pageNumber.toString(),
        pageSize: parsedPageSize as string,
        txnStartNonce: nonce,
      },
    });
    history.push(pathNameWithQuery);
  };

  const setPageSizeAndAlterHistory = (pageSize: number) => {
    const pathNameWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        page: parsedPageNumber as string,
        pageSize: pageSize.toString(),
      },
    });
    history.push(pathNameWithQuery);
  };

  let total = 0;
  let data: { list: Array<any>; firstTxStatus } | null = null;

  if (data2.data) {
    const { firstTxStatus, pendingCount, pendingTransactions } = data2.data;
    total = new BigNumber(pendingCount).toNumber();
    data = {
      // list: pendingTransactions.slice(-Number(parsedPageSize)),
      list: pendingTransactions.slice(0, parsedPageSize).map((p, index) => {
        p.status = '4';
        if (!index) {
          p.reason = firstTxStatus;
        }
        return p;
      }),
      firstTxStatus,
    };
  }

  return {
    pageNumber: parsedPageNumber,
    pageSize: parsedPageSize,
    total: total,
    realTotal: total,
    data,
    error: data2.error,
    gotoPage: setPageNumberAndAlterHistory,
    setPageSize: setPageSizeAndAlterHistory,
    mutate: () => {},
    nextPage: () => {},
    prevPage: () => {},
  };
};
