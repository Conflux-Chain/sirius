import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import TablePanel, { columnsType } from '../../components/TablePanel';

export function BlocksAndTransactions() {
  const { t } = useTranslation();
  const columnsBlocks: Array<columnsType> = [
    {
      title: 'Epoch',
      dataIndex: 'epochNumber',
      key: 'epochNumber',
      width: 100,
    },
    {
      title: 'Position',
      dataIndex: 'blockIndex',
      key: 'blockIndex',
      width: 100,
    },
    {
      title: 'Txns',
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      width: 100,
      ellipsis: true,
    },
    { title: 'Miner', dataIndex: 'miner', key: 'miner', width: 100 },
    { title: 'Avg.Gas Price', dataIndex: 'gas', key: 'gas', width: 100 }, // todo, no gas price
    {
      title: 'Gas Used/Limit',
      dataIndex: 'gasLimit',
      key: 'gasLimit',
      width: 100,
    },
    { title: 'Reward', dataIndex: 'reward', key: 'reward', width: 100 }, // todo, no reward
    {
      title: 'Age',
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 100,
    }, // todo, how to calculate age value ?
  ];
  const columnsTransactions: Array<columnsType> = [
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      width: 100,
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      width: 100,
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      width: 100,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 100,
    },
    {
      title: 'Gas Price',
      dataIndex: 'gasPrice',
      key: 'gasPrice',
      width: 100,
    },
    {
      title: 'Gas Fee',
      dataIndex: 'gas',
      key: 'gas',
      width: 100,
    },
    {
      title: 'Age',
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 100,
    },
  ];
  const tabs = [
    {
      value: 'blocks',
      label: 'Blocks',
      url: '/block/list',
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
    {
      value: 'transaction',
      label: 'Transaction',
      url: '/transaction/list',
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
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
      <TablePanel tabs={tabs} />
    </>
  );
}
