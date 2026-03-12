import React from 'react';
import { Tabs } from '../Tabs';
import { trackEvent } from '../../../utils/ga';
import { ScanEvent } from '../../../utils/gaConstants';
import { useTabs, Tab } from '../Tabs/useTabs';

export type { ColumnsType } from '@cfxjs/react-ui/dist/table/table';

export type TabsTablePanelType = {
  tabs: Tab[];
  onTabsChange?: (value: string) => void;
  query?: Record<string, string>;
};

export const TabsTablePanel = ({
  tabs,
  onTabsChange,
  query,
}: TabsTablePanelType) => {
  const { switchToTab, currentTabValue } = useTabs(tabs, query);
  const visibleTabs = tabs.filter(i => !i.hidden);

  const handleTabsChange = function (value: string) {
    switchToTab(value);
    onTabsChange && onTabsChange(value);
    // ga
    const action = tabs?.find(t => t.value === value)?.action;
    if (action && ScanEvent.tab.action[action]) {
      trackEvent({
        category: ScanEvent.tab.category,
        action: ScanEvent.tab.action[action],
      });
    }
  };
  const ui = visibleTabs.map((item, i) => {
    return (
      <Tabs.Item label={item.label} value={item.value} key={i}>
        {item.content}
      </Tabs.Item>
    );
  });

  return (
    <>
      <Tabs
        key={visibleTabs.map(i => i.value).join(',')}
        initialValue={currentTabValue}
        onChange={handleTabsChange}
      >
        {ui}
      </Tabs>
    </>
  );
};

TabsTablePanel.defaultProps = {
  tabs: [],
  onTabsChange: () => {},
};
