import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { fetchWithPrefix } from 'utils/request';

const treeToFlat = tree => {
  let list: Array<any> = [];

  try {
    const fn = (t, level: number, parentLevel) => {
      if (Array.isArray(t)) {
        t.map((item, index) => fn(item, index, parentLevel));
      } else {
        const index = `${parentLevel}_${level}`;
        list.push({
          index,
          type: `${t.action.callType || t.type}`,
          from: t.action.from,
          to: t.action.to,
          value: t.action.value,
          result: t.result,
        });
        fn(t.calls, level + 1, `${parentLevel}_${level}`);
      }
    };

    fn(tree, 0, '');
  } catch (e) {}

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
      fetchWithPrefix(`/transferTree/${address}`)
        .then(data => {
          setData2({
            ...data2,
            data: treeToFlat(data.calls),
          });
        })
        .catch(e => {
          setData2({
            ...data2,
            error: e,
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
