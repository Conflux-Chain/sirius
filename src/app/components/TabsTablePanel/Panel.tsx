import React from 'react';
import { Tabs } from '../Tabs';
import { useTabTableData } from './useTabTableData';
import { trackEvent } from '../../../utils/ga';
import { ScanEvent } from '../../../utils/gaConstants';

export type { ColumnsType } from '@cfxjs/react-ui/dist/table/table';

export type TabsTablePanelType = {
  tabs: Array<{
    hideTotalZero?: boolean;
    hidden?: boolean;
    value: string;
    action?: string;
    label:
      | ((total: number, realTotal: number, item: any) => React.ReactNode)
      | string;
    content?: React.ReactNode;
  }>;
  onTabsChange?: (value: string) => void;
};

export const TabsTablePanel = ({ tabs, onTabsChange }: TabsTablePanelType) => {
  const { total, realTotal, switchToTab, currentTabValue } = useTabTableData(
    tabs,
  );

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
  const ui = tabs
    .filter((item, i) => {
      if (
        item.hideTotalZero &&
        typeof total[i] === 'number' &&
        item.value !== currentTabValue
      ) {
        // hideTotalZero must satisfy two conditions: total === 0 && tab not activity
        return total[i];
      }
      return true;
    })
    .map((item, i) => {
      // TODO tabs item do not support class, so use `disabled` prop to hide tab
      return (
        <Tabs.Item
          label={
            typeof item.label === 'function'
              ? item.label(total[i], realTotal[i], item)
              : item.label
          }
          value={item.value}
          key={i}
          disabled={item.hidden === true}
        >
          {item.content}
        </Tabs.Item>
      );
    });

  return (
    <>
      <Tabs
        key="table-panel-tabs"
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

/**
TabsTablePanel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      // value: required, Tabs item unique ident value, used as key
      value: PropTypes.string,
      // label: required, tab item's label, there are two types:
      //  1. string
      //  2. function - (total: number, realTotal: number) => React.ReactNode | undefined.
      //     Parameter is table list total count and real total count, return value can be react node or undefined
      //     If return value is undefined, use 'value' as default
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      // base content to show, if there is table config, ignore it
      content: PropTypes.node,
      // url: optional, request url, contain location search
      url: PropTypes.string,
      // pagination: optional, Pagination component config, there are two types:
      //  1. object: Pagination component config
      //  2. boolean - if false then hide the pagination, if true then use default pagination config
      pagination: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
          page: PropTypes.number,
          pageSize: PropTypes.number,
          showPageSizeChanger: PropTypes.bool,
          showQuickJumper: PropTypes.bool,
          size: PropTypes.string,
          show: PropTypes.bool,
        }),
      ]),
      // table: optional, Table component config
      table: PropTypes.shape({
        columns: PropTypes.array,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      }),
      // hideTotalZero: optional, determine whether to this tab if total is 0
      hideTotalZero: PropTypes.bool,
    }),
  ),
  // onTabsChange: optional, Tabs component onTabsChange props
  onTabsChange: PropTypes.func,
};
 */
