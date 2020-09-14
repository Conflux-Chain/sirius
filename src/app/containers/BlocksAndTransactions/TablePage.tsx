import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Tabs, Table, Pagination } from '@cfxjs/react-ui';
import { simpleGetFetcher, useApi } from '../../../utils/api';
import useSWR from 'swr';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';

export type columnsType = {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
  ellipsis?: boolean;
};

const TablePageContext = React.createContext({
  total: 0,
  type: 'blocks',
});

function TabsTable({ url, columns, onChange, pagination }) {
  const { data, error } = useSWR([url], simpleGetFetcher);
  useEffect(() => {
    onChange && onChange(data);
  }, [data, onChange]);
  if (error) return <div>no data.</div>;
  if (!data) return <div>loading</div>;
  return (
    <>
      <Table
        tableLayout="fixed"
        columns={columns}
        data={data.result?.list || []}
      />
      <Pagination
        size="small"
        total={data.result.total}
        showPageSizeChanger
        showQuickJumper
        {...pagination}
      />
    </>
  );
}
TabsTable.defaultProps = {
  onChange: () => {}, // emit total count
  url: '',
  columns: [],
  // pagination component config, see https://react-ui-git-master.conflux-chain.vercel.app/en-us/components/pagination
  pagination: {},
};

function TabsTip({ tipsShow }) {
  const data = useContext(TablePageContext);
  const { t } = useTranslation();
  if (!tipsShow) return null;
  return (
    <div>
      {t(translations.blocksAndTransactions.totalBefore)} {data.total}{' '}
      {t(translations.blocksAndTransactions.totalAfter, {
        type: data.type,
      })}
    </div>
  );
}
TabsTip.defaultProps = {
  tipsShow: true,
};
TabsTip.propTypes = {
  tipsShow: PropTypes.bool,
};

export default function TablePage({ tabs, tipsShow, config }) {
  let history = useHistory();
  let location = useLocation();
  let { type } = useParams();
  const [total, setTotal] = useState(0);
  const handleChange = data => {
    setTotal(data?.result?.total || 0);
  };
  const handlePageChange = (page, pageSize) => {
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
    <TablePageContext.Provider
      value={{
        total,
        type,
      }}
    >
      <TabsTip tipsShow={tipsShow} />
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
              <TabsTable
                columns={item.columns}
                url={`${url}`}
                onChange={handleChange}
                pagination={{
                  onPageChange: handlePageChange,
                  onPageSizeChange: handlePageChange,
                  page: Number(query.page),
                  pageSize: Number(query.pageSize),
                }}
              />
            </Tabs.Item>
          );
        })}
      </Tabs>
    </TablePageContext.Provider>
  );
}

TablePage.defaultProps = {
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
};
TablePage.propTypes = {
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
  tipsShow: PropTypes.bool,
  config: PropTypes.shape({
    query: PropTypes.shape({
      page: PropTypes.number,
      pageSize: PropTypes.number,
    }),
  }),
};
