import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Tabs, Table, Pagination } from '@cfxjs/react-ui';

export type columnsType = {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
};

export type columnsDataType = {
  a?: string;
  b?: string;
  c?: string;
  d?: string | number;
  key: string | number;
};

export function BlocksAndTransactions() {
  const { t } = useTranslation();

  const columns: Array<columnsType> = [
    { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
    { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title3', dataIndex: 'c', key: 'c', width: 100 },
  ];
  const data: Array<columnsDataType> = [
    { a: '123', key: '1' },
    { a: 'cdd', b: 'edd', key: '2' },
    { a: '1333', c: 'eee', d: 2, key: '3' },
  ];

  return (
    <>
      <Helmet>
        <title>{t(translations.blocksAndTransactions.title)}</title>
        <meta
          name="description"
          content={t(translations.blocksAndTransactions.description)}
        />
      </Helmet>
      <Tabs initialValue="blocks">
        <Tabs.Item label="Blocks" value="blocks">
          A total of 642,127 blocks found (Showing the last 10k records)
          <Table tableLayout="fixed" columns={columns} data={data} />
          <Pagination
            size="small"
            total={data.length}
            showPageSizeChanger
            showQuickJumper
          />
        </Tabs.Item>
        <Tabs.Item label="Transactions" value="transactions">
          A total of 642,127 transactions found (Showing the last 10k records)
          <Table tableLayout="fixed" columns={columns} data={data} />
          <Pagination
            size="small"
            total={data.length}
            showPageSizeChanger
            showQuickJumper
          />
        </Tabs.Item>
      </Tabs>
    </>
  );
}
