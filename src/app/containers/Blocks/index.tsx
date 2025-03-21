import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '@cfxjs/sirius-next-common/dist/utils/media';
import { translations } from 'locales/i18n';
import { blockColumns } from '../../../utils/tableColumns';
import { Dag } from './Loadable';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Blocks() {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const url = '/block';
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsBlocksWidth = [4, 2, 2, 5, 5, 4, 8, 3, 3, 3, 5];
  const columnsBlocks = [
    blockColumns.epoch,
    blockColumns.position,
    blockColumns.txns,
    blockColumns.hashWithPivot,
    blockColumns.miner,
    blockColumns.avgGasPrice,
    blockColumns.gasUsedPercentWithProgress,
    blockColumns.gasLimit,
    blockColumns.burntFees,
    blockColumns.reward,
    blockColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({
    ...item,
    width: columnsBlocksWidth[i],
  }));

  return (
    <>
      <Helmet>
        <title>{t(translations.blocks.title)}</title>
        <meta name="description" content={t(translations.blocks.description)} />
      </Helmet>
      <PageHeader>{t(translations.blocks.title)}</PageHeader>
      {bp !== 's' && <Dag />}
      <TablePanelNew
        url={url}
        columns={columnsBlocks}
        rowKey="hash"
      ></TablePanelNew>
    </>
  );
}
