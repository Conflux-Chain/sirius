import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useSWRWithGetFecher } from 'utils/api';

export const useTableDataByHttp = (
  url: string,
  inactive = false,
  shouldFetch = true,
) => {
  const location = useLocation();
  const history = useHistory();

  let {
    page: searchPageNumber,
    pageSize: searchPageSize,
    tab,
    ...others
  } = queryString.parse(inactive ? '' : location.search);

  let parsedPageNumber = '1';
  let parsedPageSize = '10';
  let skip = '0';

  try {
    const page = (Number(searchPageNumber) - 1) * Number(searchPageSize);
    if (window.isNaN(page) || page < 0) {
      throw new Error('invalid page');
    }
    parsedPageNumber = String(searchPageNumber);
    skip = String(page);
  } catch (e) {}

  try {
    const pageSize = Number(searchPageSize);
    if (window.isNaN(pageSize) || pageSize < 0) {
      throw new Error('invalid pageSize');
    }
    parsedPageSize = String(pageSize);
  } catch (e) {}

  const urlQuery = queryString.parseUrl(url).query;
  const urlWithQuery = queryString.stringifyUrl({
    url,
    query: {
      ...others,
      // inactive is used in useTabTableData indicating the tab displaying this
      // table is not the current tab, so there's no need to sync page info, but
      // we still need to sync filter info cause the filters are applied to all
      // tables
      limit: inactive ? undefined : (parsedPageSize as string),
      skip: inactive ? undefined : (skip as string),
      ...urlQuery,
    },
  });

  const { data, error, mutate } = useSWRWithGetFecher(
    shouldFetch ? [urlWithQuery] : null,
  );

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
    total: Math.min(data?.total, data?.listLimit) || data?.total || 0, // used for pagination
    realTotal: data?.total || 0, // real total in response data
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
