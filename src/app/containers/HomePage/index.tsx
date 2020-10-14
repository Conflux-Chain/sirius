import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import Text from './../../components/Text';
import { Link } from '@cfxjs/react-ui';
import TabsTablePanel, { ColumnsType } from '../../components/TabsTablePanel';
import styled from 'styled-components';
import { useBreakpoint, media } from 'styles/media';

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
      pagination: false,
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
    {
      value: 'transaction',
      label: t(translations.blocksAndTransactions.transactions),
      url: '/transaction/list',
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
