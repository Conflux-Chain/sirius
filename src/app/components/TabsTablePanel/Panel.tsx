import React, { useState, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import Tabs from '../Tabs';
import TablePanel from '../TablePanel';
import GetTotalCount from './GetTotalCount';

import { PaginationProps } from '@cfxjs/react-ui/dist/pagination/pagination';
import { Props as TableProps } from '@cfxjs/react-ui/dist/table/table';
import { constSelector } from 'recoil';
export type { ColumnsType } from '@cfxjs/react-ui/dist/table/table';

type TablePanelConfigType = {
  value: string;
  label: string | Function;
  url: string;
  pagination?: PaginationProps & { total?: number };
  table: TableProps<unknown>;
  onDataChange?: Function;
};

type LabelCountMapType = {
  [key: string]: number;
};

// TablePanel component default props
const tablePanelConfig: TablePanelConfigType = {
  value: '',
  label: '',
  url: '',
  table: {},
};

export default function TabsTablePanel({ tabs, onTabsChange }) {
  const history = useHistory();
  const location = useLocation();
  const [labelCountMap, setLabelCountMap] = useState({});
  const cachedTabs = useRef(tabs);
  const tabsNeedToGetTotal = useMemo(() => {
    // only table kind tab need to get total count
    return cachedTabs.current.filter(
      item => item.url && item.table && typeof item.label === 'function',
    );
  }, []);
  const updateLocationSearch = newQuery => {
    const search = queryString.stringify({
      ...queryString.parse(location.search),
      ...newQuery,
    });
    history.push(`${location.pathname}?${search}`);
  };
  const tabValueArray = tabs.map(i => i.value);
  const tabValue = queryString.parse(location.search).tab || tabValueArray[0];

  useEffect(() => {
    if (location.search.indexOf('tab') === -1) {
      updateLocationSearch({
        tab: tabValueArray[0],
      });
    }
  }, [location.search]); // eslint-disable-line

  // if no tab in location search, rewrite url and rerender again
  if (location.search.indexOf('tab') === -1) {
    return null;
  }

  const handleTabsChange = (value: string): void => {
    if (typeof onTabsChange === 'function') {
      onTabsChange(value);
    }
    updateLocationSearch({
      tab: value,
    });
  };

  const handleLabelCountChange = (
    newLabelCountMap: LabelCountMapType,
  ): void => {
    setLabelCountMap({
      ...labelCountMap,
      ...newLabelCountMap,
    });
  };

  const tabsItems: Array<React.ReactNode> = [];
  const tabsLabelCountItems: Array<React.ReactNode> = [];

  cachedTabs.current.forEach(t => {
    const item = {
      ...tablePanelConfig,
      ...t,
    };
    if (item.url && item.table) {
      const handleDataChange = function ({ data }) {
        const fn = item.onDataChange;
        if (data) {
          handleLabelCountChange({
            [item.value]: data.result?.total,
          });
        }
        if (fn && typeof fn === 'function') {
          fn.apply({}, arguments);
        }
      };

      const itemLabel =
        typeof item.label === 'function'
          ? item.label(labelCountMap[item.value] || 0, item) || item.value
          : item.label;

      tabsItems.push(
        <Tabs.Item label={itemLabel} value={item.value} key={item.value}>
          <TablePanel {...item} onDataChange={handleDataChange} />
        </Tabs.Item>,
      );

      // there are three condition here
      // 1. make sure only excute when not get all tab total success
      // 2. only excute on tabs which need to get total
      // 3. skip actived tab
      if (
        Object.keys(labelCountMap).length < tabsNeedToGetTotal.length &&
        tabsNeedToGetTotal.some(t => t.value === item.value) &&
        item.value !== tabValue
      ) {
        tabsLabelCountItems.push(
          <GetTotalCount
            url={item.url}
            type={item.value}
            key={item.value}
            onChange={handleLabelCountChange}
          />,
        );
      }
    } else {
      tabsItems.push(
        <Tabs.Item label={item.label} value={item.value} key={item.value}>
          {item.content}
        </Tabs.Item>,
      );
    }
  });

  return (
    <>
      {tabsLabelCountItems}
      <Tabs initialValue={tabValue} onChange={handleTabsChange}>
        {tabsItems}
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
