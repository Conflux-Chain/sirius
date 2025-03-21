import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { blockColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

interface epochNumber {
  number: string;
}

export const Epoch = () => {
  const { number } = useParams<epochNumber>();
  const { t } = useTranslation();
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/block?minEpochNumber=${number}&maxEpochNumber=${number}`;

  const columnsWidth = [2, 4, 2, 4, 3, 4, 3, 3, 3, 4];
  const columns = [
    blockColumns.position,
    blockColumns.hashWithPivot,
    blockColumns.txns,
    blockColumns.miner,
    blockColumns.difficulty,
    blockColumns.gasUsedPercentWithProgress,
    blockColumns.gasLimit,
    blockColumns.burntFees,
    blockColumns.reward,
    blockColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <>
      <Helmet>
        <title>{t(translations.epoch.title)}</title>
        <meta name="description" content={t(translations.epoch.description)} />
      </Helmet>
      <PageHeader subtitle={number}>{t(translations.epoch.title)}</PageHeader>

      <TablePanelNew url={url} columns={columns} rowKey="hash"></TablePanelNew>
    </>
  );
};
