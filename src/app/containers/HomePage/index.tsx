import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Link } from '../../components/Link/Loadable';
import { media, useBreakpoint } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TabsTablePanel } from '../../components/TabsTablePanel/Loadable';
import { ColumnsType, useTabTableData } from '../../components/TabsTablePanel';
import { SmallChart } from '../../components/Chart/Loadable';
import { blockColunms, transactionColunms } from '../../../utils/tableColumns';
import { Notice } from './Notice';
import { ScanEvent } from '../../../utils/gaConstants';
// import { MarketInfo } from './MarketInfo';

export function HomePage() {
  const { t } = useTranslation();
  const bp = useBreakpoint();

  const columnsBlocksWidth = [4, 2, 2, 4, 6, 3, 3, 2, 5];
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

  const columnsTransactionsWidth = [4, 6, 6, 4, 3, 4, 5];
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
      action: 'latestBlocks',
      label: t(translations.blocks.latestBlocks),
      url: '/block',
      pagination: false,
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
    {
      value: 'transactions',
      action: 'latestTransactions',
      label: t(translations.transactions.latestTransactions),
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
  if (clientWidth < 600) {
    chartWidth = clientWidth - 20;
  } else if (clientWidth < 1000) {
    chartWidth = (clientWidth - 68) / 2;
  } else if (clientWidth < 1368) {
    chartWidth = (clientWidth - 116) / 4;
  } else {
    chartWidth = 323;
  }

  const { currentTabValue } = useTabTableData(tabs);

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
        {/* <MarketInfo /> */}
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
            {currentTabValue === 'blocks' ? (
              <Link
                className="viewall-link"
                href={`/blockchain/blocks`}
                ga={{
                  category: ScanEvent.menu.category,
                  action: ScanEvent.menu.action.blocks,
                }}
              >
                {bp === 's'
                  ? t(translations.general.viewAll)
                  : t(translations.general.viewAllBlocks)}
              </Link>
            ) : (
              <Link
                className="viewall-link"
                href={`/blockchain/transactions`}
                ga={{
                  category: ScanEvent.menu.category,
                  action: ScanEvent.menu.action.transactions,
                }}
              >
                {bp === 's'
                  ? t(translations.general.viewAll)
                  : t(translations.general.viewAllTxns)}
              </Link>
            )}
          </ViewAllLinkWrapper>
        </Bottom>
      </Main>
    </>
  );
}

const Main = styled.div`
  max-width: 1368px;
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
  width: 100%;
  margin-bottom: 2.2857rem;
  margin-top: 24px;
  justify-content: center;
  gap: 24px;

  ${media.m} {
    flex-wrap: wrap;
  }

  ${media.s} {
    flex-direction: column;
  }
`;

const SmallChartWrap = styled.div`
  ${media.m} {
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
