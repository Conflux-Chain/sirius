import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Link } from '@cfxjs/react-ui';
import { useBreakpoint, media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Text } from './../../components/Text/Loadable';
import { TabsTablePanel } from '../../components/TabsTablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { Status } from '../../components/Status/Loadable';

/**
 * Note: The table list is same as block&transaction page.
 */

const renderTextEllipsis = value => (
  <Text span maxWidth="5.7143rem" hoverValue={value}>
    {value}
  </Text>
);

export function HomePage() {
  const { t } = useTranslation();
  const bp = useBreakpoint();

  const columnsBlocks: ColumnsType = [
    {
      title: t(translations.blocksAndTransactions.table.block.epoch),
      dataIndex: 'epochNumber',
      key: 'epochNumber',
      width: 1,
      render: (value, row: any) => {
        let pivotTag: React.ReactNode = null;
        if (row.pivotHash === row.hash) {
          pivotTag = <img className="img" src="/pivot.svg" alt="pivot"></img>;
        }
        return (
          <StyledEpochWrapper>
            <Link href={`/epochs/${value}`}>{renderTextEllipsis(value)}</Link>
            {pivotTag}
          </StyledEpochWrapper>
        );
      },
    },
    {
      title: t(translations.blocksAndTransactions.table.block.position),
      dataIndex: 'blockIndex',
      key: 'blockIndex',
      width: 1,
    },
    {
      title: t(translations.blocksAndTransactions.table.block.txns),
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      width: 1,
    },
    {
      title: t(translations.blocksAndTransactions.table.block.hash),
      dataIndex: 'hash',
      key: 'hash',
      width: 1,
      render: value => (
        <Link href={`/blocks/${value}`}>{renderTextEllipsis(value)}</Link>
      ),
    },
    {
      title: t(translations.blocksAndTransactions.table.block.miner),
      dataIndex: 'miner',
      key: 'miner',
      width: 1,
      render: value => (
        <Link href={`/address/${value}`}>{renderTextEllipsis(value)}</Link>
      ),
    },
    {
      title: t(translations.blocksAndTransactions.table.block.avgGasPrice),
      dataIndex: 'avgGasPrice',
      key: 'avgGasPrice',
      width: 1,
    },
    {
      title: t(translations.blocksAndTransactions.table.block.gasUsedPercent),
      dataIndex: 'gasUsed',
      key: 'gasUsed',
      width: 1,
      render: (value, row: any) => {
        if (value) {
          return `${row.gasUsed}/${row.gasLimit}`; // todo, need real division
        } else {
          return '--';
        }
      },
    },
    {
      title: t(translations.blocksAndTransactions.table.block.reward),
      dataIndex: 'totalReward',
      key: 'totalReward',
      width: 1,
      render: value => (value ? `${value} CFX` : '--'),
    },
    {
      title: t(translations.blocksAndTransactions.table.block.age),
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 1,
    },
  ];

  const columnsTransactions: ColumnsType = [
    {
      title: t(translations.blocksAndTransactions.table.transactions.hash),
      dataIndex: 'hash',
      key: 'hash',
      width: 1,
      render: (value, row: any) => {
        return (
          <StyledTransactionHashWrapper>
            {row.status != '0' && <Status type={row.status} variant="dot" />}
            <Link href={`/transactions/${value}`}>
              {renderTextEllipsis(value)}
            </Link>
          </StyledTransactionHashWrapper>
        );
      },
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.from),
      dataIndex: 'from',
      key: 'from',
      width: 1,
      render: value => (
        <Link href={`/address/${value}`}>{renderTextEllipsis(value)}</Link>
      ),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.to),
      dataIndex: 'to',
      key: 'to',
      width: 1,
      render: value =>
        value ? (
          <Link href={`/address/${value}`}>{renderTextEllipsis(value)}</Link>
        ) : (
          '--'
        ),
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.value),
      dataIndex: 'value',
      key: 'value',
      width: 1,
      render: value => `${value} CFX`,
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.gasPrice),
      dataIndex: 'gasPrice',
      key: 'gasPrice',
      width: 1,
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.gasFee),
      dataIndex: 'gas',
      key: 'gas',
      width: 1,
    },
    {
      title: t(translations.blocksAndTransactions.table.transactions.age),
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 1,
    },
  ];

  const tabs = [
    {
      value: 'blocks',
      label: t(translations.blocksAndTransactions.blocks),
      url: '/block',
      pagination: false,
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
    {
      value: 'transaction',
      label: t(translations.blocksAndTransactions.transactions),
      url: '/transaction',
      pagination: false,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t(translations.metadata.title)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <Main>
        <Top>Top part</Top>
        <Bottom>
          <TabsTablePanel tabs={tabs} />
          <ViewAllLinkWrapper>
            <Link className="viewall-link" href="/blocks-and-transactions">
              {bp === 's'
                ? t(translations.general.viewAll)
                : t(translations.general.viewAllBlocksAndTxs)}
            </Link>
          </ViewAllLinkWrapper>
        </Bottom>
      </Main>
    </>
  );
}

const StyledTransactionHashWrapper = styled.span`
  display: flex;
  align-items: center;

  .status {
    margin-right: 0.5714rem;
  }
`;

const StyledEpochWrapper = styled.span`
  display: flex;
  align-items: center;

  .img {
    width: 3rem;
    height: 1.4286rem;
    margin-left: 0.5714rem;
  }
`;

const Main = styled.div`
  max-width: 73.1429rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4.57rem;
  ${media.s} {
    margin-bottom: 2rem;
  }
`;
const Top = styled.section``;
const Bottom = styled.section`
  position: relative;
  width: 100%;
  overflow-x: auto;
`;
const ViewAllLinkWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 0;
  border-bottom: 2px solid #0054fe;
  ${media.s} {
    top: 0.6429rem;
  }
  .viewall-link.link {
    color: #008dff;
  }
`;
