import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { Tooltip } from '../../components/Tooltip/Loadable';
import {
  TabLabel,
  TabsTablePanel,
} from '../../components/TabsTablePanel/Loadable';
import { blockColunms, transactionColunms } from '../../../utils/tableColumns';
import { useAge } from '../../../utils/hooks/useAge';

export function BottomTablePanel({ hash: blockHash }) {
  const { t } = useTranslation();
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsTransactionsWidth = [4, 6, 6, 4, 3, 4, 5];
  const columnsTransactions: ColumnsType = [
    transactionColunms.hash,
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasFee,
    transactionColunms.gasPrice,
    transactionColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsTransactionsWidth[i] }));

  const columnsBlocksWidth = [4, 2, 2, 4, 6, 3, 3, 5];
  const columnsBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hash,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercent,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const tabs = [
    {
      value: 'blocks',
      action: 'blockTransactions',
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
      action: 'referenceBlocks',
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
