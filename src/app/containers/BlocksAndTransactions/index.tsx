import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import TablePanel, {
  columnsType,
  TabLabel,
  TipLabel,
} from '../../components/TablePanel';
import styled from 'styled-components';

// util fn for text ellipsis
const textEllipsis = (text: number | string, number?: number): string => {
  return (text || '').toString().substr(0, number || 8) + '...';
};

export const BlocksAndTransactions = () => {
  const { t } = useTranslation();
  const [tip, setTip] = useState<any>();

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
    {
      title: 'Miner',
      dataIndex: 'miner',
      key: 'miner',
      width: 100,
      render: value => textEllipsis(value),
    },
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
      render: value => textEllipsis(value),
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      width: 100,
      render: value => textEllipsis(value),
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      width: 100,
      render: value => textEllipsis(value),
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
      // label: 'Blocks',
      label: count => {
        const left = t(translations.blocksAndTransactions.labelCountBefore);
        const right = t(translations.blocksAndTransactions.labelCountAfter, {
          type: 'blocks',
        });
        return (
          <TabLabel left={left} right={right} count={count}>
            Blocks
          </TabLabel>
        );
      },
      url: '/block/list?name=1',
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
      onDataChange: data => {
        const left = t(translations.blocksAndTransactions.tipCountBefore);
        const right = t(translations.blocksAndTransactions.tipCountAfter, {
          type: 'blocks',
        });

        setTip(
          <TipLabel
            count={data ? data.result?.total : 0}
            left={left}
            right={right}
            key="blocks"
          />,
        );
      },
    },
    {
      value: 'transaction',
      // label: 'Transactions',
      label: count => {
        const left = t(translations.blocksAndTransactions.labelCountBefore);
        const right = t(translations.blocksAndTransactions.labelCountAfter, {
          type: 'transactions',
        });
        return (
          <TabLabel left={left} right={right} count={count}>
            Transactions
          </TabLabel>
        );
      },
      url: '/transaction/list',
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
      onDataChange: (data, error) => {
        const left = t(translations.blocksAndTransactions.tipCountBefore);
        const right = t(translations.blocksAndTransactions.tipCountAfter, {
          type: 'transactions',
        });
        setTip(
          <TipLabel
            count={data ? data.result?.total : 0}
            left={left}
            right={right}
            key="transactions"
          />,
        );
      },
    },
  ];

  return (
    <BlocksAndTransactionsWrapper>
      <Helmet>
        <title>{t(translations.blocksAndTransactions.title)}</title>
        <meta
          name="description"
          content={t(translations.blocksAndTransactions.description)}
        />
      </Helmet>
      {tip}
      <TablePanel tabs={tabs} />
    </BlocksAndTransactionsWrapper>
  );
};

const BlocksAndTransactionsWrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`;
