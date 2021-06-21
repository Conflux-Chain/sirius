import { useEffect, useState } from 'react';
import { tracesInTree } from 'js-conflux-sdk/src/util/trace';
import { cfx } from 'utils/cfx';
import pubsub from 'utils/pubsub';
import queryString from 'query-string';

const treeToFlat = tree => {
  let list: Array<any> = [];
  const fn = (t, level: number, parentLevel) => {
    if (Array.isArray(t)) {
      t.map((item, index) => fn(item, index, parentLevel));
    } else {
      const index = `${parentLevel}_${level}`;
      list.push({
        index,
        type: `${t.action.callType}`,
        from: t.action.from,
        to: t.action.to,
        value: t.action.value,
        result: t.result,
      });
      fn(t.calls, level + 1, `${parentLevel}_${level}`);
    }
  };

  fn(tree, 0, '');

  return list;
};

export const useGetTxnInternalTrace = (url: string) => {
  const [data2, setData2] = useState<{
    data: any;
    error: any;
  }>({
    data: null,
    error: null,
  });

  const {
    query: { address },
  } = queryString.parseUrl(url);

  useEffect(() => {
    if (address) {
      // rpc call
      cfx
        .traceTransaction(address)
        .then(data => {
          setData2({
            ...data2,
            data: treeToFlat(tracesInTree(data)),
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  let total = 0;
  let data: { list: Array<any> } | null = null;

  if (data2.data) {
    try {
      total = data2.data.length;
      data = {
        list: data2.data,
      };
    } catch (e) {}
  }

  return {
    total: total,
    realTotal: total,
    data,
    error: data2.error,
    pageNumber: '1',
    pageSize: '10',
    gotoPage: () => {},
    setPageSize: () => {},
    mutate: () => {},
    nextPage: () => {},
    prevPage: () => {},
  };
};
