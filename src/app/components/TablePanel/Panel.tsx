import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '@cfxjs/react-ui';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import PanelTable from './PanelTable';
import PanelTip from './PanelTip';

export type columnsType = {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
  ellipsis?: boolean;
};

export const PanelContext = React.createContext({
  total: 0,
  type: 'blocks',
});

export default function Panel({ tabs, tipsShow, config }) {
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
      <PanelTip tipsShow={tipsShow} />
      <Tabs initialValue={type} onChange={handleTabsChange}>
        {tabs.map(item => {
          const query = {
            ...config.query,
            ...item.query,
            ...queryString.parse(location.search),
          };
          const search = queryString.stringify(query);
          const url = `${item.url}?${search}`;
          return (
            <Tabs.Item label={item.label} value={item.value} key={item.value}>
              <PanelTable
                columns={item.columns}
                url={`${url}`}
                onChange={handleTotalChange}
                pagination={{
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
    </PanelContext.Provider>
  );
}

Panel.defaultProps = {
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
      config: {
        query: {
          page: 1,
          pageSize: 10,
        }, // SWR url query
      } // default config
      columns: columns, // Table columns,
      tips: count => (`total ${count} blocks`)
    },
    {
      value: 'transactions',
      label: 'transactions',
      url: '/transactions/list',
      config: {
        query: {
          page: 1,
          pageSize: 10,
        }, // SWR url query
      } // default config
      columns: columns,
      tips: count => (`total ${count} transactions`)
    },
  ],
   */
  tabs: [],
  config: {
    query: {
      page: 1,
      pageSize: 10,
    },
  },
  tipsShow: true,
  paginationShow: true,
};

Panel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      url: PropTypes.string,
      config: PropTypes.shape({
        query: PropTypes.shape({
          page: PropTypes.number,
          pageSize: PropTypes.number,
        }),
      }),
      columns: PropTypes.array,
    }),
  ),
  config: PropTypes.shape({
    query: PropTypes.shape({
      page: PropTypes.number,
      pageSize: PropTypes.number,
    }),
  }),
  tipsShow: PropTypes.bool,
  paginationShow: PropTypes.bool,
};
