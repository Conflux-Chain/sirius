import React, { useMemo, useEffect } from 'react';
import { sendRequest } from 'utils/httpRequest';
import qs from 'query-string';
import { useState } from 'react';
import { Table } from '@jnoodle/antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TableProps } from '@jnoodle/antd/es/table';

interface TableProp extends Omit<TableProps<any>, 'title' | 'footer'> {
  url?: string;
  title?: ((info: any) => React.ReactNode) | React.ReactNode;
  footer?: ((info: any) => React.ReactNode) | React.ReactNode;
}

interface TableStateProp {
  data: Array<any>;
  total: number;
  listLimit?: number;
  loading: boolean;
  error: ErrorConstructor | null;
}

interface Query {
  [index: string]: string;
}

export const TablePanel = ({
  url: outerUrl,
  dataSource,
  columns,
  rowKey,
  scroll,
  tableLayout,
  pagination,
  loading: outerLoading,
  onChange,
  title,
  footer,
  ...others
}: TableProp) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();

  const [state, setState] = useState<TableStateProp>({
    data: [],
    total: 0,
    listLimit: 0,
    loading: false,
    error: null,
  });

  const getQuery = useMemo(() => {
    const { query } = qs.parseUrl(outerUrl || '');
    const searchQuery = qs.parse(search);
    const skip = searchQuery.skip || query.skip || '0';
    const limit = searchQuery.limit || query.limit || '10';

    return {
      ...query,
      ...searchQuery,
      skip: skip,
      limit: limit,
    };
  }, [outerUrl, search]);

  useEffect(() => {
    if (outerUrl) {
      const { url } = qs.parseUrl(outerUrl);

      setState({
        ...state,
        loading: true,
      });

      sendRequest({
        url: url,
        query: {
          ...getQuery,
        },
      })
        .then(resp => {
          setState({
            ...state,
            data: resp.list,
            total: resp.total,
            listLimit: resp.listLimit || 0,
            loading: false,
          });
        })
        .catch(e => {
          setState({
            ...state,
            error: e,
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerUrl, search]);

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { skip, limit, ...others } = qs.parse(search);

    let query: Query = {
      ...others,
      skip: String((current - 1) * pageSize) || '0',
      limit: pageSize || '10',
    };

    if (sorter) {
      query.orderBy = sorter.field;
      query.reverse = sorter.order === 'ascend' ? 'false' : 'true';
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query,
    });
    history.push(url);
  };

  const { data, loading, total, listLimit } = state;

  return (
    <Table
      tableLayout={tableLayout}
      scroll={scroll}
      columns={columns}
      rowKey={rowKey}
      dataSource={dataSource || data}
      pagination={
        typeof pagination === 'boolean'
          ? pagination
          : {
              showQuickJumper: true,
              showTotal: () => {
                if (listLimit && total > listLimit) {
                  return t(translations.general.totalRecordWithLimit, {
                    total,
                    limit: listLimit,
                  });
                } else {
                  return t(translations.general.totalRecord, {
                    total,
                  });
                }
              },
              pageSize: Number(getQuery.limit),
              current:
                Math.floor(Number(getQuery.skip) / Number(getQuery.limit)) + 1,
              total: Math.min(total, listLimit || 0) || total || 0,
              ...pagination,
            }
      }
      loading={outerLoading || loading}
      onChange={onChange || handleTableChange}
      title={
        title
          ? typeof title === 'function'
            ? () =>
                title({
                  data,
                  total,
                  listLimit,
                  loading,
                })
            : () => title
          : undefined
      }
      footer={
        footer
          ? typeof footer === 'function'
            ? () =>
                footer({
                  data,
                  total,
                  listLimit,
                  loading,
                })
            : () => footer
          : undefined
      }
      {...others}
    />
  );
};
TablePanel.defaultProps = {
  url: '',
  scroll: { x: 1200 },
  tableLayout: 'fixed',
  rowKey: () => Math.random().toString().substr(2),
  title: undefined,
  footer: undefined,
};
