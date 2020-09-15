import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '@cfxjs/react-ui';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import styled from 'styled-components';
import PanelTable from './PanelTable';
import PanelTip from './PanelTip';

const StyledTabsWrapper = styled.div`
  .tab {
    .label {
      font-size: 16px;
      font-family: CircularStd-Medium, CircularStd;
      font-weight: normal;
      color: rgba(11, 19, 46, 0.6);
      line-height: 24px;
      padding: 8px 3px;
    }
    .nav {
      margin: 0 8px;
    }
    &.active,
    &:hover {
      .label {
        font-weight: 500;
        color: #0b132e !important;
      }
    }
    .bottom {
      height: 6px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  header + .content {
    margin-top: 18px;
  }
`;

export type columnsType = {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number;
  ellipsis?: boolean;
  render?: (value?: any, row?: object, index?: number) => any;
};

export const PanelContext = React.createContext({
  total: 0,
  type: 'blocks',
});

export const TablePanelConfig = {
  pagination: {
    page: 1,
    pageSize: 10,
    showPageSizeChanger: true,
    showQuickJumper: true,
    size: 'small',
    show: true,
    variant: 'solid',
  },
  table: {
    rowKey: 'key',
    columns: [],
  },
  tipsShow: true,
};

export default function Panel({ tabs, config }) {
  let history = useHistory();
  let location = useLocation();
  let { type } = useParams();
  const [total, setTotal] = useState(0);

  const handleTotalChange = data => {
    setTotal(data?.result?.total || 0);
  };
  const handlePaginationChange = (page, pageSize) => {
    const search = queryString.stringify({
      ...queryString.parse(location.search),
      page,
      pageSize,
    });
    history.push(`${location.pathname}?${search}`);
  };
  const handleTabsChange = value => {
    history.push(
      `${location.pathname.split('/').slice(0, 2).join('/')}/${value}`,
    );
  };

  return (
    <PanelContext.Provider
      value={{
        total,
        type,
      }}
    >
      <PanelTip tipsShow={config.tipsShow} />
      <StyledTabsWrapper>
        <Tabs initialValue={type} onChange={handleTabsChange}>
          {tabs.map(item => {
            // merged pagination config
            const pagination = {
              ...TablePanelConfig.pagination,
              ...config.pagination,
              ...item.pagination,
            };
            // merged table config
            const table = {
              ...TablePanelConfig.table,
              ...config.table,
              ...item.table,
            };
            // merged url query config
            const query = {
              page: pagination.page,
              pageSize: pagination.pageSize,
              ...queryString.parse(location.search),
            };
            const search = queryString.stringify(query);
            const url = `${item.url}?${search}`;
            return (
              <Tabs.Item label={item.label} value={item.value} key={item.value}>
                <PanelTable
                  {...table}
                  url={`${url}`}
                  onChange={handleTotalChange}
                  pagination={{
                    ...pagination,
                    onPageChange: handlePaginationChange,
                    onPageSizeChange: handlePaginationChange,
                    page: Number(query.page),
                    pageSize: Number(query.pageSize),
                  }}
                />
              </Tabs.Item>
            );
          })}
        </Tabs>
      </StyledTabsWrapper>
    </PanelContext.Provider>
  );
}

/**
  const columns: Array<columnsType> = [{
      title: 'Epoch',
      dataIndex: 'epochNumber',
      key: 'epochNumber',
      width: 100,
  }];
  const tabs = [
    {
      value: 'blocks', // Tabs value
      label: 'blocks', // Tabs label
      url: '/blocks/list', // SWR url
      pagination: {
        page: 1,
        pageSize: 10,
      }, // table pagination config, also used for SWR url query
      table: {
        columns: columns, 
        rowKey: 'hash', 
      }, // table config
      tips: count => (`total ${count} blocks`)
    },
  ]
  */
Panel.defaultProps = {
  tabs: [],
  config: TablePanelConfig,
};

Panel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      url: PropTypes.string,
      pagination: PropTypes.shape({
        page: PropTypes.number,
        pageSize: PropTypes.number,
        showPageSizeChanger: PropTypes.bool,
        showQuickJumper: PropTypes.bool,
        size: PropTypes.string,
        show: PropTypes.bool,
      }),
      table: PropTypes.shape({
        columns: PropTypes.array,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      }),
    }),
  ),
  config: PropTypes.shape({
    pagination: PropTypes.shape({
      page: PropTypes.number,
      pageSize: PropTypes.number,
      showPageSizeChanger: PropTypes.bool,
      showQuickJumper: PropTypes.bool,
      size: PropTypes.string,
      show: PropTypes.bool,
    }),
    table: PropTypes.shape({
      columns: PropTypes.array,
      rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    }),
    tipsShow: PropTypes.bool,
  }),
};
