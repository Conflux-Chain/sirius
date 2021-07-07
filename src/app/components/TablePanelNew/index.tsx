import React, { useMemo, useEffect } from 'react';
import { reqTransactions } from 'utils/httpRequest';
import qs from 'query-string';
import { useState } from 'react';
import { Table } from '@jnoodle/antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface TransactionsWithNewTableProp {
  url: string;
  columns: Array<any>; // todo, use ant table column interface
  rowKey: string;
}

interface TransactionsWithNewTableStateProp {
  data: Array<any>;
  total: number;
  loading: boolean;
  error: ErrorConstructor | null;
}

export const TablePanel = ({
  url: outerUrl,
  columns,
  rowKey,
}: TransactionsWithNewTableProp) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();

  const [state, setState] = useState<TransactionsWithNewTableStateProp>({
    data: [],
    total: 0,
    loading: false,
    error: null,
  });

  const getSkipAndLimit = useMemo(() => {
    const { query } = qs.parseUrl(outerUrl);
    const searchQuery = qs.parse(search);
    const skip = searchQuery.skip || query.skip || '0';
    const limit = searchQuery.limit || query.limit || '10';

    return {
      skip: skip,
      limit: limit,
    };
  }, [outerUrl, search]);

  useEffect(() => {
    // const { url, query } = qs.parseUrl(outerUrl);
    // const searchQuery = qs.parse(search);

    setState({
      ...state,
      loading: true,
    });

    reqTransactions({
      query: {
        ...getSkipAndLimit,
      },
    })
      .then(resp => {
        setState({
          ...state,
          data: resp.list,
          total: Math.min(resp.total, resp.listLimit) || resp.total || 0,
          loading: false,
        });
      })
      .catch(e => {
        setState({
          ...state,
          error: e,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { skip, limit, ...others } = qs.parse(search);
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        ...others,
        skip: String((current - 1) * pageSize) || '0',
        limit: pageSize || '10',
      },
    });
    history.push(url);
  };

  const { data, loading, total } = state;

  return (
    <Table
      columns={columns}
      rowKey={rowKey}
      dataSource={data}
      pagination={{
        showQuickJumper: true,
        showTotal: total =>
          t(translations.general.totalRecord, {
            total,
          }),
        pageSize: Number(getSkipAndLimit.limit),
        current:
          Number(getSkipAndLimit.skip) / Number(getSkipAndLimit.limit) + 1,
        total: total,
      }}
      loading={loading}
      onChange={handleTableChange}
      scroll={{ x: 1000 }}
    />
  );
};
