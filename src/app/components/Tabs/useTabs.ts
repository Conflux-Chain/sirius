import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export interface Tab {
  hidden?: boolean;
  value: string;
  action?: string;
  label: React.ReactNode;
  content?: React.ReactNode;
}

export const useTabs = (tabs: Tab[], query: Record<string, string> = {}) => {
  const location = useLocation();
  const history = useHistory();
  let { tab: currentTab } = queryString.parse(location.search);
  if (!currentTab) {
    currentTab = tabs[0].value;
  }

  const switchToTab = (v: string) => {
    history.push(
      queryString.stringifyUrl({
        url: location.pathname,
        query: {
          tab: v,
          ...query,
        },
      }),
    );
  };

  return {
    switchToTab,
    currentTabValue: currentTab as string,
  };
};
