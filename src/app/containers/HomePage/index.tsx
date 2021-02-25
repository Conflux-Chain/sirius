import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Link } from '../../components/Link/Loadable';
import { useBreakpoint, media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TabsTablePanel } from '../../components/TabsTablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { SmallChart } from '../../components/Chart/Loadable';
import { blockColunms, transactionColunms } from '../../../utils/tableColumns';
import { Notice } from './Notice';
import { MarketInfo } from './MarketInfo';

export function HomePage() {
  const { t } = useTranslation();
  const bp = useBreakpoint();

  const columnsBlocksWidth = [4, 2, 2, 3, 5, 3, 3, 2, 5];
  const columnsBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hash,
    blockColunms.miner,
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercent,
    blockColunms.reward,
    blockColunms.age,
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const columnsTransactionsWidth = [4, 5, 5, 4, 3, 4, 5];
  const columnsTransactions: ColumnsType = [
    transactionColunms.hash,
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTransactionsWidth[i] }));

  const tabs = [
    {
      value: 'blocks',
      label: t(translations.blocksAndTransactions.latestBlocks),
      url: '/block',
      pagination: false,
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
    {
      value: 'transaction',
      label: t(translations.blocksAndTransactions.latestTransactions),
      url: '/transaction',
      pagination: false,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
  ];

  const clientWidth = document.body.clientWidth;
  let chartWidth;
  if (clientWidth < 1024) {
    chartWidth = (clientWidth - 44) / 2;
  } else {
    chartWidth = 238;
  }

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
        <Notice />
        <MarketInfo />
        <Top>
          <SmallChartWrap>
            <SmallChart width={chartWidth} />
          </SmallChartWrap>
          <SmallChartWrap>
            <SmallChart width={chartWidth} indicator="hashRate" />
          </SmallChartWrap>
          <SmallChartWrap>
            <SmallChart width={chartWidth} indicator="tps" />
          </SmallChartWrap>
          <SmallChartWrap>
            <SmallChart width={chartWidth} indicator="difficulty" />
          </SmallChartWrap>
        </Top>
        <Bottom>
          <TabsTablePanel tabs={tabs} />
          <ViewAllLinkWrapper>
            <Link
              className="viewall-link"
              href="/blockchain/blocks-and-transactions"
            >
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
  margin-bottom: 2.57rem;
  ${media.s} {
    margin-bottom: 0;
  }
`;
const Top = styled.section`
  display: flex;
  margin-right: -1.7143rem;
  margin-bottom: 2.2857rem;
  margin-top: 14px;
  justify-content: center;
  flex-wrap: wrap;
  ${media.m} {
    margin-right: -1rem;
    margin-bottom: 1.7143rem;
  }
`;

const SmallChartWrap = styled.div`
  margin-right: 24px;
  ${media.m} {
    margin-right: 0.8571rem;
  }
`;

const Bottom = styled.section`
  position: relative;
  width: 100%;
`;
const ViewAllLinkWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 0;
  border-bottom: 2px solid #1e3de4;
  ${media.s} {
    top: 0.6429rem;
  }
  .viewall-link.link {
    color: #1e3de4;
  }
`;
