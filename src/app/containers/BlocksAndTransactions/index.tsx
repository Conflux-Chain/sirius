import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import TabsTablePanel, {
  ColumnsType,
  TipLabel,
} from '../../components/TabsTablePanel';
import styled from 'styled-components';
import Text from './../../components/Text';
import { media } from './../../../styles/media';
import useTabTableData from '../../components/TabsTablePanel/useTabTableData';

const StyledBlocksAndTransactionsWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 0.8571rem;

  ${media.s} {
    padding: 0.2857rem 1.1429rem 1.1429rem;
  }
`;

const StyledTextWrapper = styled.span`
  font-family: CircularStd-Book, CircularStd;
  font-weight: 400;
  line-height: 1.7143rem;
  font-size: 1rem;
  &:hover {
    font-family: CircularStd-Bold, CircularStd;
    font-weight: 500;
    color: #0054fe;
  }
`;

const renderTextEllipsis = value => {
  return (
    <Text span maxwidth={'5.7143rem'} hoverValue={value}>
      <StyledTextWrapper>{value}</StyledTextWrapper>
    </Text>
  );
};

export const BlocksAndTransactions = () => {
  const { t } = useTranslation();

  const columnsBlocks: ColumnsType = [
    {
      title: t(translations.blocksAndTransactions.table.block.epoch),
      dataIndex: 'epochNumber',
      key: 'epochNumber',
      width: 100,
      render: renderTextEllipsis,
    },
    {
      title: t(translations.blocksAndTransactions.table.block.position),
      dataIndex: 'blockIndex',
      key: 'blockIndex',
      width: 100,
    },
    {
      title: t(translations.blocksAndTransactions.table.block.txns),
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      width: 100,
      ellipsis: true,
    },
    {
      title: t(translations.blocksAndTransactions.table.block.miner),
      dataIndex: 'miner',
      key: 'miner',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.blocksAndTransactions.table.block.avgGasPrice),
      dataIndex: 'gas',
      key: 'gas',
      width: 100,
    }, // todo, no gas price
    {
      title: t(translations.blocksAndTransactions.table.block.gasUsedPercent),
      dataIndex: 'gasLimit',
      key: 'gasLimit',
      width: 100,
    },
    {
      title: t(translations.blocksAndTransactions.table.block.reward),
      dataIndex: 'reward',
      key: 'reward',
      width: 100,
    }, // todo, no reward
    {
      title: t(translations.blocksAndTransactions.table.block.age),
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 100,
    }, // todo, how to calculate age value ?
  ];

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
      title: t(translations.blocksAndTransactions.table.transactions.gasFee),
      dataIndex: 'gas',
      key: 'gas',
      width: 100,
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.age),
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 100,
    },
  ];

  const tabs = [
    {
      value: 'blocks',
      label: t(translations.blocksAndTransactions.blocks),
      url: '/block/list',
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
    {
      value: 'transaction',
      label: t(translations.blocksAndTransactions.transactions),
      url: '/transaction/list',
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
  ];

  const { currentTabTotal, currentTabValue } = useTabTableData(tabs);

  return (
    <StyledBlocksAndTransactionsWrapper>
      <Helmet>
        <title>{t(translations.blocksAndTransactions.title)}</title>
        <meta
          name="description"
          content={t(translations.blocksAndTransactions.description)}
        />
      </Helmet>
      <TipLabel
        count={currentTabTotal}
        left={t(translations.blocksAndTransactions.tipCountBefore)}
        right={t(translations.blocksAndTransactions.tipCountAfter, {
          type: currentTabValue,
        })}
        key={currentTabValue}
      />
      <TabsTablePanel tabs={tabs} />
    </StyledBlocksAndTransactionsWrapper>
  );
};
