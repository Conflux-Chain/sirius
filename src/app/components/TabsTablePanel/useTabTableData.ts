import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useTableData } from './useTableData';

export const useTabTableData = t => {
  const tabs = t.filter(item => item.table);
  const location = useLocation();
  const history = useHistory();
  let { tab: currentTab, ...others } = queryString.parse(location.search);
  if (!currentTab) {
    currentTab = tabs[0].value;
  }

  let currentTabTotal = 0;

  const {
    switchToThisTab,
    pageNumber,
    pageSize,
    total,
    data,
    error,
    mutate,
    nextPage,
    prevPage,
    gotoPage,
    setPageSize,
    currentTabValue,
  } = tabs.reduce(
    (acc, { url, value }, i) => {
      const isCurrentTab = value === currentTab;
      const {
        pageNumber,
        pageSize,
        total,
        data,
        error,
        mutate,
        nextPage,
        prevPage,
        gotoPage,
        setPageSize,
        // eslint-disable-next-line react-hooks/rules-of-hooks
      } = useTableData(url);
      if (isCurrentTab) {
        currentTabTotal = total;
        acc.currentTabValue = value;
      }

      const switchToThisTab = () => {
        history.push(
          queryString.stringifyUrl({
            url: location.pathname,
            query: {
              ...others,
              page: '1',
              pageSize: '10',
              tab: value,
            },
          }),
        );
        // useSWR revalidate on mount
        // mutate();
      };

      acc.pageNumber.push(pageNumber);
      acc.pageSize.push(pageSize);
      acc.total.push(total);
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
      index = tabs.reduce((acc, { value }, i) => (v === value ? i : 0));
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
