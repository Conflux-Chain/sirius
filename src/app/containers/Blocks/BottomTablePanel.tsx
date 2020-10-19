import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import {
  TabsTablePanel,
  TabLabel,
} from '../../components/TabsTablePanel/Loadable';
import { Text } from '../../components/Text/Loadable';

const renderTextEllipsis = (children, text?) => (
  <Text span maxWidth="5.7143rem" hoverValue={text || children}>
    {children}
  </Text>
);

export function BottomTablePanel({ hash: blockHash }) {
  const { t } = useTranslation();

  const columnsTransactions: ColumnsType = [
    {
      title: t(translations.blocks.table.transactions.hash),
      dataIndex: 'hash',
      key: 'hash',
      width: 100,
      render: text =>
        renderTextEllipsis(
          <Link to={`/transactions/${text}`}>{text}</Link>,
          text,
        ),
    },
    {
      title: t(translations.blocks.table.transactions.from),
      dataIndex: 'from',
      key: 'from',
      width: 100,
      render: text =>
        renderTextEllipsis(<Link to={`/address/${text}`}>{text}</Link>, text),
    },
    {
      title: t(translations.blocks.table.transactions.to),
      dataIndex: 'to',
      key: 'to',
      width: 100,
      render: text =>
        renderTextEllipsis(<Link to={`/address/${text}`}>{text}</Link>, text),
    },
    {
      title: t(translations.blocks.table.transactions.value),
      dataIndex: 'value',
      key: 'value',
      width: 100,
    },
    {
      title: t(translations.blocks.table.transactions.fee),
      dataIndex: 'gas',
      key: 'gas',
      width: 100,
    },
    {
      title: t(translations.blocks.table.transactions.gasPrice),
      dataIndex: 'gasPrice',
      key: 'gasPrice',
      width: 100,
    },
    {
      title: t(translations.blocks.table.transactions.age),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 100,
    },
  ];

  const columnsReferenceBlocks: ColumnsType = [
    {
      title: t(translations.blocks.table.referenceBlocks.epoch),
      dataIndex: 'epochNumber',
      key: 'epochNumber',
      width: 100,
      render: text =>
        renderTextEllipsis(<Link to={`/epochs/${text}`}>{text}</Link>, text),
    },
    {
      title: t(translations.blocks.table.referenceBlocks.position),
      dataIndex: 'blockIndex',
      key: 'blockIndex',
      width: 50,
      render: value => value + 1,
    },
    {
      title: t(translations.blocks.table.referenceBlocks.hash),
      dataIndex: 'hash',
      key: 'hash',
      width: 100,
      render: text =>
        renderTextEllipsis(<Link to={`/blocks/${text}`}>{text}</Link>, text),
    },
    {
      title: t(translations.blocks.table.referenceBlocks.transactionCount),
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      width: 100,
    },
    {
      title: t(translations.blocks.table.referenceBlocks.miner),
      dataIndex: 'miner',
      key: 'miner',
      width: 100,
      render: text =>
        renderTextEllipsis(<Link to={`/address/${text}`}>{text}</Link>, text),
    },
    {
      title: t(translations.blocks.table.referenceBlocks.difficulty),
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
    },
    {
      title: t(translations.blocks.table.referenceBlocks.gasLimit),
      dataIndex: 'gasLimit',
      key: 'gasLimit',
      width: 150,
      // todo, miss gas used
    },
    {
      title: t(translations.blocks.table.referenceBlocks.age),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 100,
    },
  ];

  const tabs = [
    {
      value: 'blocks',
      label: count => (
        <TabLabel
          left={t(translations.blocks.tabs.labelCountBefore)}
          right={t(translations.blocks.tabs.labelCountAfter)}
          count={count}
        >
          {t(translations.blocks.tabs.transactions)}
        </TabLabel>
      ),
      url: `/transaction/list?blockHash=${blockHash}`,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
    {
      value: 'transaction',
      label: count => (
        <TabLabel
          left={t(translations.blocks.tabs.labelCountBefore)}
          right={t(translations.blocks.tabs.labelCountAfter)}
          count={count}
        >
          {t(translations.blocks.tabs.referenceBlocks)}
        </TabLabel>
      ),
      url: `/block/list?referredBy=${blockHash}`,
      table: {
        columns: columnsReferenceBlocks,
        rowKey: 'hash',
      },
    },
  ];

  return <TabsTablePanel tabs={tabs} />;
}
