import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import Tabs from './../Tabs';
import PanelTable from './Table';
import GetTotalCount from './GetTotalCount';
import { useBreakpoint } from './../../../styles/media';

import { PaginationProps } from '@cfxjs/react-ui/dist/pagination/pagination';
import { Props as TableProps } from '@cfxjs/react-ui/dist/table/table';
export type { ColumnsType } from '@cfxjs/react-ui/dist/table/table';

type TablePanelConfigType = {
  value: string;
  label: string;
  url: string | Function;
  pagination?: PaginationProps;
  table: TableProps<unknown>;
  onDataChange?: Function;
};

type LabelCountMapType = {
  [key: string]: number;
};

// pagination default config
const paginationConfig: PaginationProps & { show: boolean } = {
  total: 0,
  page: 1,
  pageSize: 10,
  showPageSizeChanger: true,
  showQuickJumper: true,
  size: 'small',
  variant: 'solid',
  show: true,
};
// pagination mobile default config
const paginationMobileConfig: PaginationProps = {
  ...paginationConfig,
  labelPageSizeBefore: '',
  labelPageSizeAfter: '',
  limit: 3,
};
// table default config
const tableConfig: TableProps<unknown> = {
  rowKey: 'key',
  columns: [],
  variant: 'solid',
};
// TablePanel component default props
const tablePanelConfig: TablePanelConfigType = {
  value: '',
  label: '',
  url: '',
  pagination: paginationConfig,
  table: tableConfig,
  onDataChange: function (data: any): any {},
};
const tablePanelMobileConfig: TablePanelConfigType = {
  ...tablePanelConfig,
  pagination: paginationMobileConfig,
};

export default function Panel({ tabs }) {
  const breakpoint = useBreakpoint();
  const history = useHistory();
  const location = useLocation();
  const { type } = { type: '', ...useParams() };
  const [labelCountMap, setLabelCountMap] = useState({});
  const config = breakpoint === 's' ? tablePanelMobileConfig : tablePanelConfig;

  const handlePaginationChange = (page: number, pageSize: number): void => {
    const search = queryString.stringify({
      ...queryString.parse(location.search),
      page,
      pageSize,
    });
    history.push(`${location.pathname}?${search}`);
  };
  const handleTabsChange = (value: string): void => {
    history.push(
      `${location.pathname.split('/').slice(0, 2).join('/')}/${value}`,
    );
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

  tabs.forEach(item => {
    // merged pagination config
    const pagination = {
      ...config.pagination,
      ...(typeof item.pagination === 'boolean'
        ? { show: item.pagination }
        : item.pagination),
    };
    // merged table config
    const table = {
      ...config.table,
      ...item.table,
    };
    // merged onDataChange config
    const handleDataChange = function (data) {
      const fn = item.onDataChange || config.onDataChange;
      if (data) {
        handleLabelCountChange({
          [item.value]: data.result?.total,
        });
      }
      fn.apply({}, arguments);
    };
    // merged url query config
    const itemUrlFragment = item.url.split('?');
    let itemUrl: string = '';
    let itemQuery: { [key: string]: any } = {};
    if (itemUrlFragment.length > 0) {
      itemUrl = itemUrlFragment[0];
    }
    if (itemUrlFragment.length > 1) {
      itemQuery = queryString.parse(itemUrlFragment[1]);
    }
    const query = {
      ...itemQuery,
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...queryString.parse(location.search),
    };
    const search = queryString.stringify(query);
    const url = `${itemUrl}?${search}`;

    const itemLabel =
      typeof item.label === 'function'
        ? item.label(labelCountMap[item.value] || 0, item) || item.value
        : item.label;

    tabsItems.push(
      <Tabs.Item label={itemLabel} value={item.value} key={item.value}>
        <PanelTable
          url={url}
          pagination={{
            ...pagination,
            onPageChange: handlePaginationChange,
            onPageSizeChange: handlePaginationChange,
            page: Number(query.page),
            pageSize: Number(query.pageSize),
          }}
          table={table}
          onDataChange={handleDataChange}
        />
      </Tabs.Item>,
    );

    const tabsLabelCountKeysLength = Object.keys(labelCountMap).length;
    // render once
    tabsLabelCountKeysLength < 2 &&
      tabsLabelCountItems.push(
        <GetTotalCount
          url={url}
          type={item.value}
          key={item.value}
          onChange={handleLabelCountChange}
        />,
      );
  });

  return (
    <>
      {tabsLabelCountItems}
      <Tabs initialValue={type} onChange={handleTabsChange}>
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
Panel.defaultProps = {
  tabs: [],
};

Panel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      // value: Tabs item unique ident value, used as key
      value: PropTypes.string,
      // label: tab item's label, there are two types:
      //  1. string
      //  2. function - (count: number) => React.ReactNode | undefined.
      //     Parameter is table list total count, return value can be react node or undefined
      //     If return value is undefined, use 'value' as default
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      // url: request url, contain location search
      url: PropTypes.string,
      // pagination: Pagination component config, there are two types:
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
      // table: Table component config
      table: PropTypes.shape({
        columns: PropTypes.array,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      }),
      // onDataChange: fetch response callback
      onDataChange: PropTypes.func,
    }),
  ),
};
