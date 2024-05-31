import React, { useMemo, useEffect } from 'react';
import { sendRequest } from 'utils/httpRequest';
import qs from 'query-string';
import { useState } from 'react';
import { Table } from '@cfxjs/antd';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TableProps } from '@cfxjs/antd/es/table';
import { toThousands, formatNumber } from 'utils';
import { useBreakpoint } from '@cfxjs/sirius-next-common/dist/utils/media';
import styled from 'styled-components';
import clsx from 'clsx';
import { Empty } from '@cfxjs/sirius-next-common/dist/components/Empty';

type SortOrder = 'descend' | 'ascend' | null;
type SortDirections = SortOrder[];

export const sortDirections: SortDirections = ['descend', 'ascend', 'descend'];

interface TableProp extends Omit<TableProps<any>, 'title' | 'footer'> {
  url?: string;
  title?: ((info: any) => React.ReactNode) | React.ReactNode;
  footer?: ((info: any) => React.ReactNode) | React.ReactNode;
  hideDefaultTitle?: boolean;
  hideShadow?: boolean;
  // sort list by reverse param or sort param
  sortParam?: 'reverse' | 'sort';
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
  outerUrl,
}: {
  total: number;
  listLimit: number;
  outerUrl?: string;
}) => {
  const { t } = useTranslation();

  const { url, query } = useMemo(() => {
    if (outerUrl) {
      const { url, query } = qs.parseUrl(outerUrl);
      return { url, query };
    }
    return { url: null, query: null };
  }, [outerUrl]);

  const content =
    listLimit && total > listLimit ? (
      t(translations.general.totalRecordWithLimit, {
        total: toThousands(total),
        limit: formatNumber(listLimit),
      })
    ) : (
      // @ts-ignore
      <Trans i18nKey="general.totalRecord" count={total}>
        {/* @ts-ignore */}
        You got {{ total: toThousands(total) }} messages.
      </Trans>
    );

  const handleDownloadItemClick = count => {
    if (query && query.address) {
      const address = query.address;
      window.open(
        `/stat/top-token-holder-csv?address=${address}&limit=${count}`,
        '_blank',
      );
    }
  };

  const csv = (
    <StyledSelectWrapper isEn={false} className="download">
      <Select
        onChange={handleDownloadItemClick}
        disableMatchWidth
        size="small"
        className="btnSelectContainer"
        lable={t(translations.accounts.downloadButtonText)}
      >
        {['100', '500', '1000', '3000', '5000'].map((o, index) => {
          return (
            <Select.Option key={index} value={String(index)}>
              {o}
            </Select.Option>
          );
        })}
      </Select>
    </StyledSelectWrapper>
  );

  return (
    <StyleTableTitleTotalWrapper>
      {content}
      {url && url === '/stat/tokens/holder-rank' && csv}
    </StyleTableTitleTotalWrapper>
  );
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
  showSorterTooltip = false,
  sortParam = 'reverse',
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

  const { orderBy, reverse } = useMemo(() => qs.parse(search), [search]);

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
      const query = { ...getQuery } as qs.ParsedQuery<string>;
      if (sortParam === 'sort') {
        if (query.reverse === 'false') {
          query.sort = 'asc';
        } else {
          query.sort = 'desc';
        }
        delete query.reverse;
      }

      setState({
        ...state,
        loading: true,
      });

      sendRequest({
        url: url,
        query,
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

  const handleTableChange = (pagination, _, sorter, extra) => {
    const { current = 1, pageSize = 10 } = pagination;
    const { skip, limit, ...others } = qs.parse(search);
    const { action } = extra;

    let query: Query = {
      ...others,
      skip: action === 'sort' ? '0' : String((current - 1) * pageSize) || '0',
      limit: pageSize || '10',
    };

    if (sorter) {
      query.orderBy = sortKeyMap[String(sorter.field)] || sorter.field;
      query.reverse = sorter.order === 'ascend' ? 'false' : 'true';
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query,
    });
    history.push(url);
  };

  const { data, loading, total: stateTotal, listLimit } = state;
  const total =
    dataSource && Array.isArray(dataSource) ? dataSource.length : stateTotal;

  let _columns: any = columns;
  if (orderBy !== undefined) {
    _columns = columns?.map(c => {
      delete c.defaultSortOrder;
      if (c.key === orderBy) {
        c.defaultSortOrder = reverse === 'true' ? 'descend' : 'ascend';
      }
      return c;
    });
  }

  return (
    <Table
      sortDirections={['descend', 'ascend']}
      className={clsx(className, {
        shadowed: !hideShadow,
      })}
      tableLayout={tableLayout}
      scroll={scroll}
      columns={_columns}
      rowKey={rowKey}
      dataSource={dataSource || data}
      showSorterTooltip={showSorterTooltip}
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
          : () => (
              <TitleTotal
                total={total}
                listLimit={listLimit || total}
                outerUrl={outerUrl}
              />
            ) // default show total records in title
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledSelectWrapper = styled.div<{
  isEn: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1.4286rem;
    right: 1.4286rem;
  }

  .selectLabel {
    &:first-child {
      margin-right: 0.4286rem;
    }

    &:last-child {
      margin-left: ${props => (props.isEn ? '0' : '0.4286rem')};
    }
  }

  .select.btnSelectContainer .option.selected,
  .selectLabel {
    color: #8890a4;
    font-size: 0.8571rem;
    font-weight: normal;
  }

  .select.btnSelectContainer {
    background: rgba(30, 61, 228, 0.04);
    &:hover {
      background: rgba(30, 61, 228, 0.08);
    }
  }

  /* download button */
  &.download {
    margin-left: 0.7143rem;
  }
`;
