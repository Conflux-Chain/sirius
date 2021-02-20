import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useTableData } from './useTableData';

export const useTabTableData = tabs => {
  const location = useLocation();
  const history = useHistory();
  let {
    tab: currentTab,
    page: pageCurrent,
    pageSize: pageSizeCurrent,
    ...others
  } = queryString.parse(location.search);
  if (!currentTab) {
    currentTab = tabs[0].value;
  }

  let currentTabTotal = 0;

  const {
    switchToThisTab,
    pageNumber,
    pageSize,
    total,
    realTotal,
    data,
    error,
    mutate,
    nextPage,
    prevPage,
    gotoPage,
    setPageSize,
    currentTabValue,
  } = tabs.reduce(
    (acc, { url = '', value, table, hidden = false }, i) => {
      const isCurrentTab = value === currentTab;
      const {
        pageNumber,
        pageSize,
        total,
        realTotal,
        data,
        error,
        mutate,
        nextPage,
        prevPage,
        gotoPage,
        setPageSize,
        // has data table and not hidden tab should fetch data
        //
        // eslint-disable-next-line react-hooks/rules-of-hooks
      } = useTableData(url, !isCurrentTab, !!table && !hidden);
      if (isCurrentTab) {
        currentTabTotal = total;
        acc.currentTabValue = value;
      }

      const switchToThisTab = () => {
        let query = {};
        if (table) {
          query = {
            ...others,
            page: '1',
            pageSize: '10',
            tab: value,
          };
        } else {
          query = {
            ...others,
            tab: value,
          };
        }
        history.push(
          queryString.stringifyUrl({
            url: location.pathname,
            query,
          }),
        );
        // useSWR revalidate on mount
        // mutate();
      };

      acc.pageNumber.push(pageNumber);
      acc.pageSize.push(pageSize);
      acc.total.push(total);
      acc.realTotal.push(realTotal);
      acc.data.push(data);
      acc.error.push(error);
      acc.mutate.push(mutate);
      acc.nextPage.push(nextPage);
      acc.prevPage.push(prevPage);
      acc.gotoPage.push(gotoPage);
      acc.setPageSize.push(setPageSize);
      acc.switchToThisTab.push(switchToThisTab);

      return acc;
    },
    {
      pageNumber: [],
      pageSize: [],
      total: [],
      realTotal: [],
      data: [],
      error: [],
      mutate: [],
      nextPage: [],
      prevPage: [],
      gotoPage: [],
      setPageSize: [],
      switchToThisTab: [],
    },
  );

  const switchToTab = (v: string) => {
    let index;
    if (tabs.length === 1) {
      index = 0;
    } else {
      index = tabs.reduce((acc, { value }, i) => {
        if (acc === 0 && v === value) return i;
        return acc;
      }, 0);
    }
    return switchToThisTab[index]();
  };

  return {
    switchToTab,
    currentTabValue,
    currentTabTotal,
    switchToThisTab,
    pageNumber,
    pageSize,
    total,
    realTotal,
    data,
    error,
    mutate,
    nextPage,
    prevPage,
    gotoPage,
    setPageSize,
    tabs,
  };
};
