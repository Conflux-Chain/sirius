import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ColumnsType, TabsTablePanel } from '../../components/TabsTablePanel';
import { Text } from '../../components/Text/Loadable';
import { DatePicker } from '@cfxjs/react-ui';

const renderTextEllipsis = value => (
  <Text span maxWidth="5.7143rem" hoverValue={value}>
    {value}
  </Text>
);

export function ContractTabsTablePanel({ address }) {
  const { t } = useTranslation();

  const columnsTransactions: ColumnsType = [
    {
      title: t(translations.blocksAndTransactions.table.transactions.hash),
      dataIndex: 'hash',
      key: 'hash',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.from),
      dataIndex: 'from',
      key: 'from',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.to),
      dataIndex: 'to',
      key: 'to',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.value),
      dataIndex: 'value',
      key: 'value',
      width: 100,
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.gasPrice),
      dataIndex: 'gasPrice',
      key: 'gasPrice',
      width: 100,
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.age),
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 100,
    },
  ];

  const columnsTokenTrasfers: ColumnsType = [
    {
      title: t(translations.blocksAndTransactions.table.transactions.hash),
      dataIndex: 'hash',
      key: 'hash',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.from),
      dataIndex: 'from',
      key: 'from',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.to),
      dataIndex: 'to',
      key: 'to',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.to),
      dataIndex: 'value',
      key: 'quantity',
      width: 100,
      // render: value => renderTextEllipsis(value),
    },
  ];

  const tabs = [
    {
      value: 'transaction',
      label: t(translations.blocksAndTransactions.transactions),
      url: `/transaction?accountAddress=${address}`,
      pagination: false,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
    // {
    //   value: 'tokenTransaction',
    //   label: t(translations.blocksAndTransactions.transactions),
    //   url: '/transaction/list',
    //   pagination: false,
    //   table: {
    //     columns: columnsTokenTrasfers,
    //     rowKey: 'hash',
    //   },
    // },
  ];

  return (
    <>
      <DatePicker.RangePicker />
      <TabsTablePanel tabs={tabs} />
    </>
  );
}

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 1.1429rem;
    height: 1.1429rem;
    margin-right: 0.5714rem;
  }
`;
