import React, { useMemo, useEffect } from 'react';
import { sendRequest } from 'utils/httpRequest';
import qs from 'query-string';
import { useState } from 'react';
import { Table } from '@jnoodle/antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TableProps } from '@jnoodle/antd/es/table';
import { toThousands, formatNumber } from 'utils';
import { useBreakpoint } from 'styles/media';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Empty } from 'app/components/Empty/Loadable';

interface TableProp extends Omit<TableProps<any>, 'title' | 'footer'> {
  url?: string;
  title?: ((info: any) => React.ReactNode) | React.ReactNode;
  footer?: ((info: any) => React.ReactNode) | React.ReactNode;
  hideDefaultTitle?: boolean;
  hideShadow?: boolean;
  // customize and rename sort key
  sortKeyMap?: {
    [index: string]: string;
  };
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

export const TitleTotal = ({
  total,
  listLimit,
}: {
  total: number;
  listLimit: number;
}) => {
  const { t } = useTranslation();

  const content =
    listLimit && total > listLimit
      ? t(translations.general.totalRecordWithLimit, {
          total: toThousands(total),
          limit: formatNumber(listLimit),
        })
      : t(translations.general.totalRecord, {
          total: toThousands(total),
        });

  return <StyleTableTitleTotalWrapper>{content}</StyleTableTitleTotalWrapper>;
};

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
  hideDefaultTitle,
  hideShadow,
  className,
  sortKeyMap = {},
  ...others
}: TableProp) => {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const bp = useBreakpoint();

  const [state, setState] = useState<TableStateProp>({
    data: [],
    total: 0,
    listLimit: 0,
    loading: false,
    error: null,
  });

  const getQuery = useMemo(() => {
    let defaultPagination = !pagination
      ? {
          pageSize: '10',
          current: '1',
        }
      : pagination;
    const { query } = qs.parseUrl(outerUrl || '');
    const searchQuery = qs.parse(search);
    const skip = searchQuery.skip || query.skip || '0';

    const limit =
      searchQuery.limit || query.limit || defaultPagination.pageSize || '10';

    return {
      ...query,
      ...searchQuery,
      skip: skip,
      limit: limit,
    };
  }, [outerUrl, search, pagination]);

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

    console.log('sorter: ', sorter, sorter.order);

    if (sorter) {
      query.orderBy = sortKeyMap[sorter.field] || sorter.field;
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
      sortDirections={['descend', 'ascend']}
      className={clsx(className, {
        shadowed: !hideShadow,
      })}
      tableLayout={tableLayout}
      scroll={scroll}
      columns={columns}
      rowKey={rowKey}
      dataSource={dataSource || data}
      pagination={
        typeof pagination === 'boolean'
          ? pagination
          : {
              showLessItems: true,
              hideOnSinglePage: false,
              size: bp === 's' ? 'small' : 'default',
              showSizeChanger: true,
              showQuickJumper: true,
              // showTotal: () => {
              //   if (listLimit && total > listLimit) {
              //     return t(translations.general.totalRecordWithLimit, {
              //       total: toThousands(total),
              //       limit: listLimit,
              //     });
              //   } else {
              //     return t(translations.general.totalRecord, {
              //       total: toThousands(total),
              //     });
              //   }
              // },
              current:
                Math.floor(Number(getQuery.skip) / Number(getQuery.limit)) + 1,
              total: Math.min(total, listLimit || 0) || total || 0,
              ...pagination,
              pageSize: Number(getQuery.limit),
            }
      }
      loading={outerLoading || loading}
      onChange={onChange || handleTableChange}
      locale={{ emptyText: <Empty show={true} /> }}
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
          : hideDefaultTitle
          ? undefined
          : () => <TitleTotal total={total} listLimit={listLimit || total} /> // default show total records in title
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
  hideDefaultTitle: false,
  hideShadow: false,
};

const StyleTableTitleTotalWrapper = styled.div`
  margin-right: 10px;
`;
