import React from 'react';
import Tabs from '../Tabs';
import TablePanel from '../TablePanel';
import useTabTableData from './useTabTableData';
import { TablePanelType } from './../TablePanel';

export type { ColumnsType } from '@cfxjs/react-ui/dist/table/table';

export type TabsTablePanelType = {
  tabs: Array<
    {
      value: string;
      label: ((count: number) => React.ReactNode) | string;
      content?: React.ReactNode;
    } & Partial<TablePanelType>
  >;
  onTabsChange?: (value: string) => void;
  hideTotalZero?: boolean;
};

function TabsTablePanel({
  tabs,
  onTabsChange,
  hideTotalZero,
}: TabsTablePanelType) {
  const { total, switchToTab, currentTabValue } = useTabTableData(tabs);
  const handleTabsChange = function (value: string) {
    switchToTab(value);
    onTabsChange && onTabsChange(value);
  };
  const ui = tabs
    .filter((_, i) => {
      if (hideTotalZero && typeof total[i] === 'number') {
        return total[i];
      }
      return true;
    })
    .map((item, i) => {
      return (
        <Tabs.Item
          label={
            typeof item.label === 'function' ? item.label(total[i]) : item.label
          }
          value={item.value}
          key={item.value}
        >
          {item.table ? <TablePanel {...item} /> : item.content}
        </Tabs.Item>
      );
    });

  return (
    <>
      <Tabs initialValue={currentTabValue} onChange={handleTabsChange}>
        {ui}
      </Tabs>
    </>
  );
}

TabsTablePanel.defaultProps = {
  tabs: [],
  onTabsChange: () => {},
  hideTotalZero: false,
};

export default TabsTablePanel;

/**
TabsTablePanel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      // value: required, Tabs item unique ident value, used as key
      value: PropTypes.string,
      // label: required, tab item's label, there are two types:
      //  1. string
      //  2. function - (count: number) => React.ReactNode | undefined.
      //     Parameter is table list total count, return value can be react node or undefined
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
    }),
  ),
  // onTabsChange: optional, Tabs component onTabsChange props
  onTabsChange: PropTypes.func,
  // hideTotalZero: optional, determine whether to hide 0 total tab panel, default is false
  hideTotalZero: PropTypes.bool,
};
 */
