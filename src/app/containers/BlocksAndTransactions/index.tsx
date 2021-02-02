import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from 'styles/media';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import {
  TabsTablePanel,
  TipLabel,
} from '../../components/TabsTablePanel/Loadable';
import { useTabTableData } from '../../components/TabsTablePanel/useTabTableData';
import { blockColunms, transactionColunms } from '../../../utils/tableColumns';
import { Dag } from './Loadable';

export function BlocksAndTransactions() {
  const { t } = useTranslation();
  const bp = useBreakpoint();

  const columnsBlocksWidth = [4, 2, 2, 3, 5, 3, 3, 3, 5];
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
      label: t(translations.blocksAndTransactions.blocks),
      url: '/block',
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
    {
      value: 'transactions',
      label: t(translations.blocksAndTransactions.transactions),
      url: '/transaction',
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
  ];

  const { currentTabTotal, currentTabValue } = useTabTableData(tabs);
  return (
    <>
      <Helmet>
        <title>{t(translations.blocksAndTransactions.title)}</title>
        <meta
          name="description"
          content={t(translations.blocksAndTransactions.description)}
        />
      </Helmet>
      {bp !== 's' && <Dag />}
      <TipLabel
        total={currentTabTotal}
        left={t(translations.blocksAndTransactions.tipCountBefore)}
        right={t(translations.blocksAndTransactions.tipCountAfter, {
          type: t(
            translations.blocksAndTransactions[currentTabValue],
          ).toLowerCase(),
        })}
        key={currentTabValue}
      />
      <TabsTablePanel tabs={tabs} />
    </>
  );
}
