import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ColumnsType } from 'app/components/TabsTablePanel';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import {
  TabLabel,
  TabsTablePanel,
} from 'app/components/TabsTablePanel/Loadable';
import { blockColunms, transactionColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { useParams } from 'react-router-dom';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Helmet } from 'react-helmet-async';
import { DescriptionPanel } from './DescriptionPanel';
import styled from 'styled-components/macro';
import { reqBlockDetail } from 'utils/httpRequest';
import { useBreakpoint } from 'styles/media';

export function Block() {
  const bp = useBreakpoint();
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const [ageFormat, toggleAgeFormat] = useAge();
  const [{ transactionCount, refereeHashes }, setBlockDetail] = useState<any>({
    transactionCount: 0,
    refereeHashes: [],
  });

  useEffect(() => {
    reqBlockDetail({
      hash,
    }).then(body => {
      setBlockDetail(body);
    });
  }, [hash]);

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

  const columnsBlocksWidth = [4, 2, 2, 4, 6, 3, 5, 5];
  const columnsBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hash,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const tabs = [
    {
      value: 'overview',
      label: t(translations.block.overview),
      content: <DescriptionPanel />,
    },
    {
      value: 'blocks',
      action: 'blockTransactions',
      label: (total: number, realTotal: number) => {
        return (
          <TabLabel
            total={transactionCount || total}
            realTotal={transactionCount || realTotal}
            showTooltip={bp !== 's'}
          >
            {bp === 's' ? (
              t(translations.block.tabs.transactions)
            ) : (
              <Tooltip
                text={t(translations.toolTip.block.transactions)}
                placement="top"
              >
                {t(translations.block.tabs.transactions)}
              </Tooltip>
            )}
          </TabLabel>
        );
      },
      url: `/transaction?blockHash=${hash}`,
      table: {
        columns: columnsTransactions,
        rowKey: 'hash',
      },
      hidden: !transactionCount,
    },
    {
      value: 'transaction',
      action: 'referenceBlocks',
      label: (total: number, realTotal: number) => {
        return (
          <TabLabel
            total={total}
            realTotal={realTotal}
            showTooltip={bp !== 's'}
          >
            {bp === 's' ? (
              t(translations.block.tabs.referenceBlocks)
            ) : (
              <Tooltip
                text={t(translations.toolTip.block.referenceBlocks)}
                placement="top"
              >
                {t(translations.block.tabs.referenceBlocks)}
              </Tooltip>
            )}
          </TabLabel>
        );
      },
      hideTotalZero: true,
      url: `/block?referredBy=${hash}`,
      table: {
        columns: columnsBlocks,
        rowKey: 'hash',
      },
      hidden: !refereeHashes?.length,
    },
  ];

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.block.title)}</title>
        <meta name="description" content={t(translations.block.description)} />
      </Helmet>
      <PageHeader>{t(translations.block.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  margin-bottom: 2.2857rem;
`;
