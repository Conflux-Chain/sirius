import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '../Tabs';
import TablePanel from '../TablePanel';
import useTabTableData from './useTabTableData';

export type { ColumnsType } from '@cfxjs/react-ui/dist/table/table';

export default function TabsTablePanel({ tabs }) {
  const { total, switchToTab, currentTabValue } = useTabTableData(tabs);

  const ui = tabs.map((item, i) => {
    return (
      <Tabs.Item
        label={
          typeof item.label === 'function' ? item.label(total[i]) : item.label
        }
        value={item.value}
        key={item.value}
      >
        <TablePanel total={total[i]} onDataChange={() => {}} {...item} />
      </Tabs.Item>
    );
  });

  return (
    <>
      <Tabs initialValue={currentTabValue} onChange={switchToTab}>
        {ui}
      </Tabs>
    </>
  );
}

/**
  // for example:
  const tabs = [
    {
      value: 'blocks', // Tabs value
      label: 'blocks', // Tabs label
      url: '/blocks/list', // SWR url
      pagination: {
        page: 1,
        pageSize: 50,
      }, // table pagination config, also used for SWR url query
      table: {
        columns: columns, 
        rowKey: 'hash', 
      }, // table config
      onDataChange: ()=>{} // when table data changed, execute callback
    },
  ]
  */
TabsTablePanel.defaultProps = {
  tabs: [],
  onTabsChange: () => {},
};

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
      // onDataChange: optional, only for table type content, fetch response callback
      onDataChange: PropTypes.func,
    }),
  ),
  // onTabsChange: optional, Tabs component onTabsChange props
  onTabsChange: PropTypes.func,
};
