import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import useSWR from 'swr';
import { simpleGetFetcher } from '../../../utils/api';

export const useTableData = (url: string) => {
  const location = useLocation();
  const history = useHistory();

  let {
    page: parsedPageNumber,
    pageSize: parsedPageSize,
    tab,
    ...others
  } = queryString.parse(location.search);

  if (!parsedPageNumber && !parsedPageSize) {
    parsedPageNumber = '1';
    parsedPageSize = '10';
  }

  const urlWithQuery = queryString.stringifyUrl({
    url,
    query: {
      ...others,
      page: parsedPageNumber as string,
      pageSize: parsedPageSize as string,
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, mutate } = useSWR([urlWithQuery], simpleGetFetcher);
  const setPageNumberAndAlterHistory = (pageNumber: number) => {
    const pathNameWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        tab,
        page: pageNumber.toString(),
        pageSize: parsedPageSize as string,
      },
    });
    history.push(pathNameWithQuery);
  };

  const setPageSizeAndAlterHistory = (pageSize: number) => {
    const pathNameWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        tab,
        page: parsedPageNumber as string,
        pageSize: pageSize.toString(),
      },
    });
    history.push(pathNameWithQuery);
  };

  return {
    pageNumber: parsedPageNumber,
    pageSize: parsedPageSize,
    total: data?.result?.total,
    data,
    error,
    mutate,
    nextPage: () => setPageNumberAndAlterHistory(Number(parsedPageNumber) + 1),
    prevPage: () =>
      setPageNumberAndAlterHistory(Number(parsedPageNumber) - 1 || 1),
    gotoPage: setPageNumberAndAlterHistory,
    setPageSize: setPageSizeAndAlterHistory,
  };
};
