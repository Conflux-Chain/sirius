import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { Tooltip } from '../../components/Tooltip/Loadable';
import {
  TabsTablePanel,
  TabLabel,
} from '../../components/TabsTablePanel/Loadable';
import { blockColunms, transactionColunms } from '../../../utils/tableColumns';

export function BottomTablePanel({ hash: blockHash }) {
  const { t } = useTranslation();

  const columnsTransactionsWidth = [4, 5, 5, 4, 4, 3, 5];
  const columnsTransactions: ColumnsType = [
    transactionColunms.hash,
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasFee,
    transactionColunms.gasPrice,
    transactionColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTransactionsWidth[i] }));

  const columnsBlocksWidth = [3, 2, 3, 2, 5, 3, 3, 4];
  const columnsBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.hash,
    blockColunms.txns,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercent,
    blockColunms.age,
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const tabs = [
    {
      value: 'blocks',
      label: (total: number, realTotal: number) => (
        <TabLabel total={total} realTotal={realTotal}>
          <Tooltip
            text={t(translations.toolTip.block.transactions)}
            placement="top"
          >
            {t(translations.block.tabs.transactions)}
          </Tooltip>
        </TabLabel>
      ),
      url: `/transaction?blockHash=${blockHash}`,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
    },
    {
      value: 'transaction',
      label: (total: number, realTotal: number) => (
        <TabLabel total={total} realTotal={realTotal}>
          <Tooltip
            text={t(translations.toolTip.block.referenceBlocks)}
            placement="top"
          >
            {t(translations.block.tabs.referenceBlocks)}
          </Tooltip>
        </TabLabel>
      ),
      hideTotalZero: true,
      url: `/block?referredBy=${blockHash}`,
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
    },
  ];

  return <TabsTablePanel tabs={tabs} />;
}
