import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { blockColunms } from '../../../utils/tableColumns';
import { useAge } from '../../../utils/hooks/useAge';

interface epochNumber {
  number: string;
}

export const Epoch = () => {
  const { number } = useParams<epochNumber>();
  const { t } = useTranslation();
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsWidth = [2, 4, 2, 4, 3, 4, 4];
  const columns: ColumnsType = [
    blockColunms.position,
    blockColunms.hashWithPivot,
    blockColunms.txns,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <>
      <Helmet>
        <title>{t(translations.epoch.title)}</title>
        <meta name="description" content={t(translations.epoch.description)} />
      </Helmet>
      <PageHeader subtitle={number}>{t(translations.epoch.title)}</PageHeader>
      <TablePanel
        url={`/block?epochNumber=${number}`}
        table={{ columns: columns, rowKey: 'hash' }}
      />
    </>
  );
};
